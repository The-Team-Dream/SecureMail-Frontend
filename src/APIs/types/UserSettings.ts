export type ThemeMode = 'LIGHT' | 'DARK' | 'SYSTEM';

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

/** What we PUT/PATCH to the server (as FormData fields) */
export interface UpdateProfilePayload {
  username?: string;
  avatar?: File; // actual File object, not a URL string
}

/** What the server returns after a successful profile update */
export interface ProfileUpdateResponse {
  username?: string;
  avatarUrl?: string | null;  // user-settings response shape
  avatar?: string | null;     // auth/profile response shape
  user?: {
    username?: string;
    avatar?: string | null;
  };
}

/** Payload for PATCH /user-settings/password */
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
