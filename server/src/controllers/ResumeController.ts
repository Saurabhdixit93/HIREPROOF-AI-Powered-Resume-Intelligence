import { Hono } from 'hono';
import { ResumeService } from '../services/ResumeService';
import { authMiddleware } from '../middleware/auth';
import { AppEnv } from '../app';
import { z } from 'zod';

const resumes = new Hono<AppEnv>();

// Apply auth middleware to all resume routes
resumes.use('*', authMiddleware);

resumes.get('/', async (c) => {
  const userId = c.get('userId');
  const list = await ResumeService.list(userId);
  return c.json({ success: true, data: list });
});

resumes.post('/', async (c) => {
  const userId = c.get('userId');
  const body = await c.req.json();
  const resume = await ResumeService.create(userId, body);
  return c.json({ success: true, data: resume }, 201);
});

resumes.get('/:id', async (c) => {
  const userId = c.get('userId');
  const resumeId = c.req.param('id');
  try {
    const resume = await ResumeService.getById(userId, resumeId);
    return c.json({ success: true, data: resume });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 404);
  }
});

resumes.patch('/:id', async (c) => {
  const userId = c.get('userId');
  const resumeId = c.req.param('id');
  const body = await c.req.json();
  try {
    const resume = await ResumeService.update(userId, resumeId, body);
    return c.json({ success: true, data: resume });
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 404);
  }
});

resumes.delete('/:id', async (c) => {
  const userId = c.get('userId');
  const resumeId = c.req.param('id');
  try {
    const result = await ResumeService.delete(userId, resumeId);
    return c.json(result);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 404);
  }
});

resumes.post('/:id/duplicate', async (c) => {
  const userId = c.get('userId');
  const resumeId = c.req.param('id');
  try {
    const resume = await ResumeService.duplicate(userId, resumeId);
    return c.json({ success: true, data: resume }, 201);
  } catch (error: any) {
    return c.json({ success: false, message: error.message }, 404);
  }
});

export default resumes;
