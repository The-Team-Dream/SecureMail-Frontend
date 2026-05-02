export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  category: 'threats' | 'updates' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string; 
}

export interface NotificationsResponse {
  data: Notification[];
  total: number;
  page: number;
  totalPages: number;
}