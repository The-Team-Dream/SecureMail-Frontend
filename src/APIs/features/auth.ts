import axiosInstance from "@/lib/axios";
import {
  SigninData,
  SigninResponse,
  SignupData,
  SignupResponse,
  VerifyOtpData,
  ResendOtpData,
  ForgetPasswordData,
  ResetPasswordData,
} from "../../types/auth";
import Cookies from "js-cookie";

export const signup = async (formData: SignupData): Promise<SignupResponse> => {
  const res = await axiosInstance.post<SignupResponse>(
    "/auth/register",
    formData,
  );
  return res.data;
};

export const signin = async (formData: SigninData): Promise<SigninResponse> => {
  const res = await axiosInstance.post<SigninResponse>("/auth/login", formData);
  return res.data;
};

export const verifyOtp = async (
  formData: VerifyOtpData,
): Promise<VerifyOtpData> => {
  const res = await axiosInstance.post<VerifyOtpData>(
    "/auth/verify-register-otp",
    formData,
  );
  return res.data;
};

export const resendOtp = async (
  formData: ResendOtpData,
): Promise<ResendOtpData> => {
  const res = await axiosInstance.post<ResendOtpData>(
    "/auth/verify-register-otp",
    formData,
  );
  return res.data;
};

export const forgetPassword = async (
  formData: ForgetPasswordData,
): Promise<ForgetPasswordData> => {
  const res = await axiosInstance.post<ForgetPasswordData>(
    "/auth/forget-password",
    formData,
  );
  return res.data;
};

export const resetPassword = async (
  formData: ResetPasswordData,
): Promise<ResetPasswordData> => {
  const res = await axiosInstance.post<ResetPasswordData>(
    "/auth/reset-password",
    formData,
  );
  return res.data;
};
export const logout = async (): Promise<{
  message: string;
}> => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};
export const getUserData = async () => {
  const res = await axiosInstance.get("/user/profile");
  return res.data;
};
