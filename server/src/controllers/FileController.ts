import { Hono } from 'hono';
import { FileService } from '../services/FileService';
import { authMiddleware } from '../middleware/auth';
import { AppEnv } from '../app';

const files = new Hono<AppEnv>();

files.use('*', authMiddleware);

files.post('/upload', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'] as any; // Cast to any because Hono.Body doesn't have File type natively sometimes in older versions

  if (!file) {
    return c.json({ success: false, message: 'No file provided' }, 400);
  }

  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const result = await FileService.upload(buffer) as any;
    
    return c.json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
      }
    });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

files.delete('/:publicId', async (c) => {
  const publicId = c.req.param('publicId');
  try {
    await FileService.delete(publicId);
    return c.json({ success: true });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 500);
  }
});

export default files;
