import axiosInstance from "@/lib/axios";
import { ResetPasswordData } from "../../types/auth";

export const resetPassword = async (
  formData: ResetPasswordData,
): Promise<ResetPasswordData> => {
  const res = await axiosInstance.post<ResetPasswordData>(
    "/auth/reset-password",
    formData,
  );
  return res.data;
};
