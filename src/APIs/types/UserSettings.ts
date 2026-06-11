export type ThemeMode = "LIGHT" | "DARK" | "SYSTEM";

export interface UserSettings {
  username: string;
  email: string;
  avatarUrl: string | null;
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
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

export interface ProfileUpdateResponse {
  username?: string;
  avatarUrl?: string | null;
  avatar?: string | null;
  user?: {
    username?: string;
    avatar?: string | null;
  };
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  message?: string;
  data?: {
    message?: string;
  };
}
