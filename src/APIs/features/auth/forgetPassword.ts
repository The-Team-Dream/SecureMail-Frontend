import axiosInstance from "@/lib/axios";
import { ForgetPasswordData } from "../../types/auth";

export const forgetPassword = async (
  formData: ForgetPasswordData,
): Promise<ForgetPasswordData> => {
  const res = await axiosInstance.post<ForgetPasswordData>(
    "/auth/forget-password",
    formData,
  );
  return res.data;
};
