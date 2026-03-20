import apiClient from "@/lib/apiClient";

export interface INotification {
  _id: string;
  userId: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
  action?: string;
  actionUrl?: string;
  jobId?: string;
  read: boolean;
  createdAt: string;
}

export class NotificationService {
  static async getNotifications(limit = 20) {
    const response = await apiClient.get<{ success: boolean; data: { notifications: INotification[]; unreadCount: number } }>(`/notifications?limit=${limit}`);
    return response.data.data;
  }

  static async markAsRead(id: string) {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return response.data;
  }

  static async markAllAsRead() {
    const response = await apiClient.patch('/notifications/read-all');
    return response.data;
  }
}
