import { serve } from '@hono/node-server';
import app from './app';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import { SocketService } from './services/SocketService';

// Initialize background workers
import './jobs/pdfWorker';

dotenv.config();

const port = Number(process.env.PORT) || 4000;

const startServer = async () => {
  await connectDB();
  
  console.log(`🚀 Server is running on port ${port}`);

  const server = serve({
    fetch: app.fetch,
    port,
  });

  // Initialize Real-time Socket Service
  SocketService.initialize(server as any);
};

startServer();
