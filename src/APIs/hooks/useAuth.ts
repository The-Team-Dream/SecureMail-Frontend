import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  forgotPassword,
  ForgotPasswordPayload,
  logout,
  otpResponse,
  ResendOtpPayload,
  signin,
  SigninPayload,
  SigninResponse,
  signup,
  SignupPayload,
  SignupResponse,
  updatePassword,
  UpdatePasswordPayload,
  verifyOtp,
  VerifyOtpPayload,
} from "../features/auth";

export const useSignup = (options?: {
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
}) => {
  return useMutation<any, any, SignupPayload>({
    mutationFn: (data: SignupPayload) => signup(data),
    ...options,
  });
};

export const useSignin = (
  options?: UseMutationOptions<any, any, SigninPayload>,
) => {
  return useMutation<any, any, SigninPayload>({
    mutationFn: (data: SigninPayload) => signin(data),
    ...options,
  });
};
export const useVerifyOtp = (
  options?: UseMutationOptions<any, any, VerifyOtpPayload>,
) => {
  return useMutation<any, any, VerifyOtpPayload>({
    mutationFn: (data: VerifyOtpPayload) => verifyOtp(data),
    ...options,
  });
};
export const useResendOtp = (
  options?: UseMutationOptions<any, any, ResendOtpPayload>,
) => {
  return useMutation<any, any, ResendOtpPayload>({
    mutationFn: (data: ResendOtpPayload) => verifyOtp(data),
    ...options,
  });
};
export const useForgotPassword = (
  options?: UseMutationOptions<any, any, ForgotPasswordPayload>,
) => {
  return useMutation<any, any, ForgotPasswordPayload>({
    mutationFn: (data: ForgotPasswordPayload) => forgotPassword(data),
    ...options,
  });
};

export const useLogout = () => {
  return () => logout();
};
export const useUpdatePassword = (
  options?: UseMutationOptions<any, any, UpdatePasswordPayload>,
) => {
  return useMutation<any, any, UpdatePasswordPayload>({
    mutationFn: (data: UpdatePasswordPayload) => updatePassword(data),
    ...options,
  });
};
