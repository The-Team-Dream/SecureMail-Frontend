export type NotificationType = 'NEW_EMAIL_RECEIVED' | 'NEW_LOGIN_DETECTED';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata: {
    // Email related
    score?: number;
    emailId?: number;
    subject?: string;
    verdict?: string;
    fromAddr?: string;
    // Login related
    loginAt?: string;
    deviceOs?: string;
    ipAddress?: string;
    sessionId?: number;
    deviceBrowser?: string;
  };
  mailBoxId: number | null;
  emailId: number | null;
  createdAt: string;
}

export interface NotificationsResponse {
  data: {
    data: Notification[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
  success: boolean;
  message: string;
}
