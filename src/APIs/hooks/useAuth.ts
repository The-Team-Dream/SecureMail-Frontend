import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  forgetPassword,
  signin,
  signup,
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
} from "../../types/auth";

export const useSignup = (options?: {
  onSuccess?: (res: any) => void;
  onError?: (err: any) => void;
}) => {
  return useMutation<any, any, SignupPayload>({
    mutationFn: signup,
    ...options,
  });
};

export const useSignin = (
  options?: UseMutationOptions<any, any, SigninPayload>,
) => {
  return useMutation<any, any, SigninPayload>({
    mutationFn: signin,
    ...options,
  });
};

export const useVerifyOtp = (
  options?: UseMutationOptions<any, any, VerifyOtpPayload>,
) => {
  return useMutation<any, any, VerifyOtpPayload>({
    mutationFn: verifyOtp,
    ...options,
  });
};
export const useResendOtp = (
  options?: UseMutationOptions<any, any, ResendOtpPayload>,
) => {
  return useMutation<any, any, ResendOtpPayload>({
    mutationFn: resendOtp,
    ...options,
  });
};
export const useForgetPassword = (
  options?: UseMutationOptions<any, any, ForgetPasswordPayload>,
) => {
  return useMutation<any, any, ForgetPasswordPayload>({
    mutationFn: forgetPassword,
    ...options,
  });
};
export const useResetPassword = (
  options?: UseMutationOptions<any, any, ResetPasswordPayload>,
) => {
  return useMutation<any, any, ResetPasswordPayload>({
    mutationFn: resetPassword,
    ...options,
  });
};
