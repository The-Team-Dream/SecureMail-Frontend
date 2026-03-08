import axiosInstance from "@/lib/axios";
import Cookies from "js-cookie";
import {
  ForgetPasswordPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  SigninPayload,
  SignupPayload,
  VerifyOtpPayload,
} from "../types";
export type SocialProvider = "google" | "outlook";

export const signup = async (formData: SignupPayload): Promise<any> => {
  const res = await axiosInstance.post("/auth/register", formData);
  return res.data;
};

export const signin = async (payload: SigninPayload) => {
  const res = await axiosInstance.post("/auth/login", payload);
  return res.data;
};

export const oauth = async (payload: {
  provider: SocialProvider;
}): Promise<any> => {
  const res = await axiosInstance.post(`/oauth`, payload);
  return res.data;
};

export const verifyOtp = async (payload: VerifyOtpPayload): Promise<any> => {
  const res = await axiosInstance.post("/auth/verify-register-otp", payload);
  return res.data;
};

export const resendOtp = async (payload: ResendOtpPayload): Promise<any> => {
  const res = await axiosInstance.post("/resendOtp", payload);
  return res.data;
};

export const forgetPassword = async (
  payload: ForgetPasswordPayload,
): Promise<any> => {
  const res = await axiosInstance.post("/auth/forget-password", payload);
  return res.data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<any> => {
  const res = await axiosInstance.post("/auth/reset-password", payload);
  return res.data;
};

// export const logout = async () => {
//   const res = await axiosInstance.post("/auth/logout");
//   return res.data;
// };

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};
