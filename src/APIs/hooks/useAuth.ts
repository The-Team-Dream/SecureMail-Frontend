import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  AuthError,
  otpResponse,
  resendOtpPayload,
  signin,
  signinPayload,
  SigninResponse,
  signup,
  signupPayload,
  SignupResponse,
  verifyOtp,
  verifyOtpPayload,
} from "../features/auth";

export const useSignup = (options?: {
  onSuccess?: (res: SignupResponse) => void;
  onError?: (err: AuthError) => void;
}) => {
  return useMutation<SignupResponse, AuthError, signupPayload>({
    mutationFn: (data: signupPayload) => signup(data),
    ...options,
  });
};

export const useSignin = (
  options?: UseMutationOptions<SigninResponse, AuthError, signinPayload>,
) => {
  return useMutation<SigninResponse, AuthError, signinPayload>({
    mutationFn: (data: signinPayload) => signin(data),
    ...options,
  });
};
export const useVerifyOtp = (
  options?: UseMutationOptions<any, any, verifyOtpPayload>,
) => {
  return useMutation<any, any, verifyOtpPayload>({
    mutationFn: (data: verifyOtpPayload) => verifyOtp(data),
    ...options,
  });
};
export const useResendOtp = (
  options?: UseMutationOptions<any, any, resendOtpPayload>,
) => {
  return useMutation<any, any, verifyOtpPayload>({
    mutationFn: (data: verifyOtpPayload) => verifyOtp(data),
    ...options,
  });
};
