import { Queue } from "bullmq";
import connection from "../config/redis";

export const pdfQueue = new Queue("pdf-generation", {
  connection: connection as any,
});

export const addPDFJob = async (resumeId: string, userId: string) => {
  return await pdfQueue.add("generate", { resumeId, userId });
};
