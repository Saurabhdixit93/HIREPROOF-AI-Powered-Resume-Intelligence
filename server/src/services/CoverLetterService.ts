import { PDFParse } from "pdf-parse";
import { aiService } from "./AIService";
import puppeteer from "puppeteer";
import { User } from "../repositories/User";

export class CoverLetterService {
  static async parseResume(fileBuffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    return result.text;
  }

  static async generateVariations(
    resumeText: string,
    jobTitle: string,
    jobDescription: string,
    provider?: string,
    model?: string,
  ) {
    const systemPrompt = `You are an elite career coach and expert copywriter. 
    Your goal is to generate 5 distinct, high-impact cover letter variations based on a candidate's resume and a target job description.
    
    Each variation should have a unique tone:
    1. Professional & Balanced: Classic, authoritative, and safe.
    2. Visionary & Innovative: Focused on future-thinking and industry disruption.
    3. Action-Oriented & Direct: Short, punchy, focused on results and metrics.
    4. Strategic & Analytical: Deep focus on problem-solving and methodology.
    5. Enthusiastic & Culture-First: Focused on passion for the brand and team fit.

    Return the result as a JSON array of strings, where each string is the full text of a cover letter.
    Do not include any metadata or explanations in the JSON.`;

    const userPrompt = `
    Job Title: ${jobTitle}
    Job Description: ${jobDescription}
    
    Candidate Resume Data:
    ${resumeText}
    `;

    const response = await aiService.generate(
      {
        systemPrompt,
        userPrompt,
        responseFormat: "json",
        model,
      },
      provider,
    );

    try {
      let cleanContent = response.content.trim();

      // Attempt to extract the JSON array if surrounded by text or markdown fences
      const firstBracket = cleanContent.indexOf("[");
      const lastBracket = cleanContent.lastIndexOf("]");

      if (
        firstBracket !== -1 &&
        lastBracket !== -1 &&
        lastBracket > firstBracket
      ) {
        cleanContent = cleanContent.substring(firstBracket, lastBracket + 1);
      } else {
        // Fallback to old markdown fence removal if brackets not found
        cleanContent = cleanContent
          .replace(/^```json\n?/, "")
          .replace(/\n?```$/, "")
          .trim();
      }

      const array = JSON.parse(cleanContent);
      return Array.isArray(array) ? array : [cleanContent];
    } catch (e) {
      // Fallback if AI doesn't return clean JSON
      return [response.content];
    }
  }

  static async generatePDF(content: string, name: string): Promise<Buffer> {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    try {
      const page = await browser.newPage();
      const html = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <script src="https://cdn.tailwindcss.com"></script>
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700;900&display=swap" rel="stylesheet">
          <style>
            body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
            .letter { width: 210mm; min-height: 297mm; padding: 25mm; margin: 0 auto; box-sizing: border-box; }
            .content { white-space: pre-wrap; line-height: 1.6; color: #1a202c; font-size: 11pt; }
          </style>
        </head>
        <body>
          <div class="letter">
            <!-- AI provides the header in its content -->
            <div class="content">
${content}
            </div>
          </div>
        </body>
        </html>
      `;

      await page.setContent(html, { waitUntil: "networkidle0" });
      const pdfBuffer = await page.pdf({
        format: "A4",
        printBackground: true,
      });

      return Buffer.from(pdfBuffer);
    } finally {
      await browser.close();
    }
  }

  static async saveParsedResume(
    userId: string,
    fileName: string,
    text: string,
  ) {
    return await User.findByIdAndUpdate(
      userId,
      {
        $push: {
          parsedResumes: { fileName, text, uploadedAt: new Date() },
        },
      },
      { new: true },
    );
  }
}
