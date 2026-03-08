import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  forgetPassword,
  logout,
  oauth,
  signin,
  signup,
  SocialProvider,
  resetPassword,
  verifyOtp,
  resendOtp,
} from "../features/auth";
import {
  ForgetPasswordPayload,
  ResendOtpPayload,
  SigninPayload,
  SignupPayload,
  ResetPasswordPayload,
  VerifyOtpPayload,
} from "../types";

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

export const useOauth = (
  options?: UseMutationOptions<any, any, { provider: SocialProvider }>,
) => {
  return useMutation({
    mutationFn: oauth,
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
    mutationFn: (data: ResendOtpPayload) => resendOtp(data),
    ...options,
  });
};
export const useForgetPassword = (
  options?: UseMutationOptions<any, any, ForgetPasswordPayload>,
) => {
  return useMutation<any, any, ForgetPasswordPayload>({
    mutationFn: (data: ForgetPasswordPayload) => forgetPassword(data),
    ...options,
  });
};
export const useResetPassword = (
  options?: UseMutationOptions<any, any, ResetPasswordPayload>,
) => {
  return useMutation<any, any, ResetPasswordPayload>({
    mutationFn: (data: ResetPasswordPayload) => resetPassword(data),
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<any, any, void>) => {
  return useMutation<any, any, void>({
    mutationFn: logout,
    ...options,
  });
};
