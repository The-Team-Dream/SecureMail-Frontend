import axiosInstance from "@/lib/axios";
import {
  UserSettings,
  ProfileUpdateResponse,
  ChangePasswordPayload,
  ChangePasswordResponse,
} from "../types/UserSettings";

export const settingsApi = {
  getSettings: async (): Promise<UserSettings> => {
    const res = await axiosInstance.get<UserSettings>("/user-settings");
    return res.data;
  },

  updateProfile: async (formData: FormData): Promise<ProfileUpdateResponse> => {
    const res = await axiosInstance.patch<
      { data?: ProfileUpdateResponse } & ProfileUpdateResponse
    >("/user-settings/profile", formData, {
      headers: {
        "Content-Type": undefined,
      },
    });
    return res.data?.data ?? res.data;
  },

  changePassword: async (
    data: ChangePasswordPayload,
  ): Promise<ChangePasswordResponse> => {
    const res = await axiosInstance.patch<ChangePasswordResponse>(
      "/user-settings/password",
      data,
    );
    return res.data;
  },

  updateTheme: async (themeMode: "LIGHT" | "DARK"): Promise<UserSettings> => {
    const res = await axiosInstance.patch<UserSettings>(
      "/user-settings/theme",
      { themeMode },
    );
    return res.data;
  },

  setup2FA: async (): Promise<UserSettings> => {
    const res = await axiosInstance.post<UserSettings>(
      "/user-settings/2fa/setup",
    );
    return res.data;
  },

  enable2FA: async (code: string): Promise<UserSettings> => {
    const res = await axiosInstance.post<UserSettings>(
      "/user-settings/2fa/enable",
      { code },
    );
    return res.data;
  },

  disable2FA: async (code: string): Promise<UserSettings> => {
    const res = await axiosInstance.post<UserSettings>(
      "/user-settings/2fa/disable",
      { code },
    );
    return res.data;
  },
};
