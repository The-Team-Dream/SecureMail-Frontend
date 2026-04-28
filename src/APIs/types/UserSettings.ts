export type ThemeMode = 'LIGHT' | 'DARK' | 'SYSTEM';

export interface UserSettings {
  username: string;
  email: string;
  avatarUrl: string | null;
  themeMode: ThemeMode;
  notifications: boolean;
  isTwoFactorEnabled: boolean;
}

export interface TwoFactorSetupResponse {
  secret: string;
  otpauthUrl: string;
}

export interface UpdateProfilePayload {
  username?: string;
  avatar?: File;
}