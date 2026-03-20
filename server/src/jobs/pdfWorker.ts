import { Worker } from "bullmq";
import connection from "../config/redis";
import { ResumeService } from "../services/ResumeService";
import { generatePDF } from "../utils/pdfGenerator";
import { FileService } from "../services/FileService";
import { SocketService } from "../services/SocketService";

export const pdfWorker = new Worker(
  "pdf-generation",
  async (job) => {
    const { resumeId, userId } = job.data;
    console.log(`Processing PDF for resume ${resumeId}...`);

    try {
      console.log(
        `🔍 DEBUG [PDF Worker]: Attempting fetch for userId: ${userId}, resumeId: ${resumeId}`,
      );
      // 1. Fetch resume data - Corrected argument order (userId, resumeId)
      const resume = await ResumeService.getById(userId, resumeId);
      if (!resume) throw new Error("Resume not found");

      // 2. Generate PDF
      console.log(`Generating PDF via Puppeteer...`);
      const pdfBuffer = await generatePDF(resume);

      // 3. Upload to Cloudinary with explicit type and validation
      console.log(
        `Uploading to Cloudinary (Buffer size: ${pdfBuffer.length} bytes)...`,
      );

      if (pdfBuffer.length < 1000) {
        throw new Error(
          `Generated PDF seems too small (${pdfBuffer.length} bytes). Portions might be missing.`,
        );
      }

      const result: any = await FileService.upload(
        pdfBuffer,
        "generated_pdfs",
        "raw",
      );
      const downloadUrl = result.secure_url;

      // 4. Send notification with the Download link
      await SocketService.sendNotification(userId, "notification", {
        title: "PDF Export Complete",
        message: "Your resume has been successfully exported to PDF.",
        type: "success",
        action: "Download",
        actionUrl: downloadUrl, // Frontend needs to intercept this and window.open it
        jobId: job.id,
      });

      console.log(
        `PDF successfully processed for resume ${resumeId}. Download URL: ${downloadUrl}`,
      );
      return downloadUrl;
    } catch (error: any) {
      console.error(`Failed to process PDF for resume ${resumeId}:`, error);
      await SocketService.sendNotification(userId, "notification", {
        title: "PDF Export Failed",
        message: `An error occurred while generating your PDF: ${error.message}`,
        type: "error",
        jobId: job.id,
      });
      throw error;
    }
  },
  { connection: connection as any },
);

pdfWorker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed with error: ${err.message}`);
});
