import dotenv from 'dotenv';
import path from 'path';

// Load .env.local first, then .env
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
dotenv.config();

function getEnv(name: string, defaultValue?: string): string {
  const value = process.env[name] || defaultValue;
  if (!value) {
    throw new Error(`Environment variable ${name} is missing`);
  }
  return value;
}

export const config = {
  port: parseInt(getEnv('PORT', '3001'), 10),
  mongoUri: getEnv('MONGODB_URI'),
  jwtSecret: getEnv('JWT_SECRET'),
  frontendUrl: getEnv('FRONTEND_URL', 'http://localhost:3000'),
  redisUrl: getEnv('REDIS_URL', 'redis://localhost:6379'),
  cloudinary: {
    cloudName: getEnv('CLOUDINARY_CLOUD_NAME'),
    apiKey: getEnv('CLOUDINARY_API_KEY'),
    apiSecret: getEnv('CLOUDINARY_API_SECRET'),
  },
  ai: {
    openaiKey: getEnv('OPENAI_API_KEY'),
    anthropicKey: getEnv('ANTHROPIC_API_KEY'),
    geminiKey: getEnv('GEMINI_API_KEY'),
    openrouterKey: getEnv('OPENROUTER_API_KEY', 'sk-or-v1-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
    nvidiaKey: getEnv('NVIDIA_API_KEY', 'nvapi-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'),
  }
};
