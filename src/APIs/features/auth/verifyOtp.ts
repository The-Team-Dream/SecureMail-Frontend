import axiosInstance from "@/lib/axios";
import { VerifyOtpData, VerifyOtpResponse } from "../../types/auth";

export const verifyOtp = async (
  formData: VerifyOtpData,
): Promise<VerifyOtpResponse> => {
  const res = await axiosInstance.post<VerifyOtpResponse>(
    "/auth/verify-register-otp",
    formData,
  );
  return res.data;
};
