import axiosInstance from '@/lib/axios';
import { UserSettings } from '../types/UserSettings';

export const settingsApi = {
  getSettings: async ():Promise<UserSettings> => {
    const res = await axiosInstance.get<UserSettings>('/user-settings');
    return res.data;
  },

  updateProfile: async (formData: FormData): Promise<UserSettings> => {
    const res = await axiosInstance.patch<UserSettings>('/user-settings/profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  },

  changePassword: async (data: any): Promise<UserSettings> => {
    const res = await axiosInstance.patch<UserSettings>('/user-settings/password', data);
    return res.data;
  },

  updateTheme: async (themeMode: 'LIGHT' | 'DARK'): Promise<UserSettings> => {
    const res = await axiosInstance.patch<UserSettings>('/user-settings/theme', { themeMode });
    return res.data;
  },

  setup2FA: async (): Promise<UserSettings> => {
    const res = await axiosInstance.post<UserSettings>('/user-settings/2fa/setup');
    return res.data;
  },

  enable2FA: async (code: string): Promise<UserSettings> => {
    const res = await axiosInstance.post<UserSettings>('/user-settings/2fa/enable', { code });
    return res.data;
  },

  disable2FA: async (code: string): Promise<UserSettings> => {
    const res = await axiosInstance.post<UserSettings>('/user-settings/2fa/disable', { code });
    return res.data;
  },
};