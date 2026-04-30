import axiosInstance from "@/lib/axios";
import { baseURL } from "@/lib/axios";
import {
  SigninData,
  SigninResponse,
  SignupData,
  SignupResponse,
  VerifyOtpData,
  VerifyOtpResponse,
  ResendOtpData,
  ForgetPasswordData,
  ResetPasswordData,
  OAuthProvider,
} from "../../types/auth";

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
): Promise<VerifyOtpResponse> => {
  const res = await axiosInstance.post<VerifyOtpResponse>(
    "/auth/verify-register-otp",
    formData,
  );
  return res.data;
};

export const resendOtp = async (
  formData: ResendOtpData,
): Promise<VerifyOtpResponse> => {
  const res = await axiosInstance.post<VerifyOtpResponse>(
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

export const getOAuthLoginUrl = (provider: OAuthProvider): string => {
  const providerEndpointMap: Record<OAuthProvider, string> = {
    google: "/auth/google/login",
    outlook: "/auth/outlook/login",
  };

  return `${baseURL}${providerEndpointMap[provider]}`;
};

export const validateOAuthToken = async (token: string) => {
  const res = await axiosInstance.get("/user/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};
