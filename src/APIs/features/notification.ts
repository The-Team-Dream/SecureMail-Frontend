import axiosInstance from '@/lib/axios';
import { Notification, NotificationsResponse } from '../types/Notification';


export const notificationsApi = {
  getNotifications: async (page = 1, limit = 20):Promise<NotificationsResponse> => {
    const res = await axiosInstance.get<NotificationsResponse>('/notifications', { 
      params: { page, limit } 
    });
    return res.data;
  },

  getUnreadCount: async ():Promise<{ count: number }> => {
    const res = await axiosInstance.get<{ count: number }>('/notifications/unread-count');
    return res.data;
  },

  readAllNotifications: async ():Promise<NotificationsResponse> => {
    const res = await axiosInstance.patch<NotificationsResponse>('/notifications/read-all');
    return res.data;
  },

  readOneNotification: async (id: string):Promise<NotificationsResponse> => {
    const res = await axiosInstance.patch<NotificationsResponse>(`/notifications/${id}/read`);
    return res.data;
  },

  deleteNotification: async (id: string):Promise<NotificationsResponse> => {
    const res = await axiosInstance.delete<NotificationsResponse>(`/notifications/${id}`);
    return res.data;
  },
};