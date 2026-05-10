import axiosInstance from "@/lib/axios";
import { ProfileUpdateResponse } from "../../types/UserSettings";

export const updateProfile = async (
  formData: FormData,
): Promise<ProfileUpdateResponse> => {
  const res = await axiosInstance.patch<
    { data?: ProfileUpdateResponse } & ProfileUpdateResponse
  >("/user-settings/profile", formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
  return res.data?.data ?? res.data;
};
