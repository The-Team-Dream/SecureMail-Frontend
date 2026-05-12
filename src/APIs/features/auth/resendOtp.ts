import axiosInstance from "@/lib/axios";
import { ResendOtpData } from "../../types/auth";

export const resendOtp = async (formData: ResendOtpData): Promise<void> => {
  const res = await axiosInstance.post("/auth/resend-otp", formData);
  return res.data;
};
