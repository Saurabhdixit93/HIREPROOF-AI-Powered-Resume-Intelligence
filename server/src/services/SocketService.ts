import { Server, Socket } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { Notification } from '../models/Notification';

interface SocketData {
  userId: string;
}

export class SocketService {
  private static io: Server<any, any, any, SocketData>;

  public static initialize(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: config.frontendUrl,
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    // Authentication Middleware
    this.io.use((socket, next) => {
      try {
        // Authenticate via authorization header or query param
        let token = socket.handshake.auth?.token || socket.handshake.query?.token;
        
        // Remove Bearer prefix if present
        if (token && token.startsWith('Bearer ')) {
          token = token.substring(7);
        }

        if (!token) {
          return next(new Error('Authentication error: Token missing'));
        }

        const decoded = jwt.verify(token, config.jwtSecret) as { id: string };
        
        // Ensure data object exists and assign userId
        socket.data = { userId: decoded.id };
        
        next();
      } catch (error) {
        return next(new Error('Authentication error: Invalid token'));
      }
    });

    this.io.on('connection', (socket) => {
      const userId = socket.data.userId;
      
      // Join a room specifically for this user to receive personal notifications
      socket.join(userId);
      console.log(`[Socket.io] User connected: ${userId} (Socket ID: ${socket.id})`);

      socket.on('disconnect', () => {
        console.log(`[Socket.io] User disconnected: ${userId} (Socket ID: ${socket.id})`);
      });
    });

    console.log('[Socket.io] Initialized successfully');
  }

  /**
   * Broadcast and save a notification to a specific user
   */
  public static async sendNotification(userId: string, event: string, data: any) {
    try {
      // 1. Save to Database
      const notification = await Notification.create({
        userId,
        title: data.title,
        message: data.message,
        type: data.type || 'info',
        action: data.action,
        actionUrl: data.actionUrl,
        jobId: data.jobId,
        read: false,
      });

      // 2. Emit to connected socket (if active)
      if (this.io) {
        // Send the complete notification object including the MongoDB _id
        this.io.to(userId).emit(event, { ...data, id: notification._id, createdAt: notification.createdAt });
      }
    } catch (error) {
      console.error('[Socket.io] Error saving notification:', error);
    }
  }
}
