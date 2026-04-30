export interface UserSession {
  id: number;
  ipAddress: string;
  deviceOs: string;
  deviceBrowser: string;
  userAgent: string;
  loginAt: string;
  expiresAt: string;
  isCurrent: boolean;
}
