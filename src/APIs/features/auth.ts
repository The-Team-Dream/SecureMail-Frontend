import axiosInstance from "@/lib/axios";
import {
  ForgetPasswordPayload,
  ResendOtpPayload,
  ResetPasswordPayload,
  SigninPayload,
  SignupPayload,
  VerifyOtpPayload,
} from "../../types/auth";
export const signup = async (
  payload: SignupPayload,
): Promise<SignupPayload> => {
  const res = await axiosInstance.post<SignupPayload>(
    "/auth/register",
    payload,
  );
  return res.data;
};

export const signin = async (
  payload: SigninPayload,
): Promise<SigninPayload> => {
  const res = await axiosInstance.post<SigninPayload>("/auth/login", payload);
  return res.data;
};

export const verifyOtp = async (
  payload: VerifyOtpPayload,
): Promise<VerifyOtpPayload> => {
  const res = await axiosInstance.post<VerifyOtpPayload>(
    "/auth/verify-register-otp",
    payload,
  );
  return res.data;
};

export const resendOtp = async (
  payload: ResendOtpPayload,
): Promise<ResendOtpPayload> => {
  const res = await axiosInstance.post<ResendOtpPayload>(
    "/auth/resend-otp",
    payload,
  );
  return res.data;
};

export const forgetPassword = async (
  payload: ForgetPasswordPayload,
): Promise<ForgetPasswordPayload> => {
  const res = await axiosInstance.post<ForgetPasswordPayload>(
    "/auth/forget-password",
    payload,
  );
  return res.data;
};

export const resetPassword = async (
  payload: ResetPasswordPayload,
): Promise<ResetPasswordPayload> => {
  const res = await axiosInstance.post<ResetPasswordPayload>(
    "/auth/reset-password",
    payload,
  );
  return res.data;
};
