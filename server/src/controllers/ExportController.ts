import { Hono } from 'hono';
import { authMiddleware } from '../middleware/auth';
import { AppEnv } from '../app';
import { SocketService } from '../services/SocketService';
import { addPDFJob } from '../jobs/pdfQueue';

const exportController = new Hono<AppEnv>();

exportController.use('*', authMiddleware);

exportController.post('/pdf', async (c) => {
  const { resumeId } = await c.req.json();

  if (!resumeId) {
    return c.json({ success: false, message: 'resumeId is required' }, 400);
  }

  // Queue the background job in Redis using BullMQ
  const job = await addPDFJob(resumeId, c.var.userId);
  const jobId = job.id || `pdf_${Date.now()}`;
  
  // The worker (pdfWorker.ts) will handle generating the PDF via Puppeteer
  // and uploading to Cloudinary, then emitting the completion notification
  // back to the user when it resolves.

  return c.json({
    success: true,
    data: {
      jobId,
      status: 'queued',
      message: 'PDF generation has been queued. You will receive a notification when it is ready.',
    },
  });
});

exportController.get('/:jobId/status', async (c) => {
  const jobId = c.req.param('jobId');

  // In production, this would check BullMQ job status.
  // For now, return a mock completed status.
  return c.json({
    success: true,
    data: {
      jobId,
      status: 'completed',
      downloadUrl: null, // Would be a Cloudinary or S3 URL in production
    },
  });
});

export default exportController;
