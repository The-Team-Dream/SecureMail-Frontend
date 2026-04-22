import {
  useMutation,
  UseMutationOptions,
  useQuery,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import Cookies from "js-cookie";
import {
  forgetPassword,
  signin,
  signup,
  resetPassword,
  verifyOtp,
  resendOtp,
  logout,
  getUserData,
} from "../features/auth";
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
export const useSignup = (
  options?: UseMutationOptions<SignupResponse, AxiosError, SignupData>,
) => {
  return useMutation<SignupResponse, AxiosError, SignupData>({
    mutationFn: signup,
    ...options,
  });
};

export const useSignin = (
  options?: UseMutationOptions<SigninResponse, AxiosError, SigninData>,
) => {
  return useMutation<SigninResponse, AxiosError, SigninData>({
    mutationFn: signin,
    ...options,
  });
};

export const useVerifyOtp = (
  options?: UseMutationOptions<VerifyOtpResponse, AxiosError, VerifyOtpData>,
) => {
  return useMutation<VerifyOtpResponse, AxiosError, VerifyOtpData>({
    mutationFn: verifyOtp,
    ...options,
  });
};
export const useResendOtp = (
  options?: UseMutationOptions<any, any, ResendOtpData>,
) => {
  return useMutation<any, any, ResendOtpData>({
    mutationFn: resendOtp,
    ...options,
  });
};
export const useForgetPassword = (
  options?: UseMutationOptions<any, any, ForgetPasswordData>,
) => {
  return useMutation<any, any, ForgetPasswordData>({
    mutationFn: forgetPassword,
    ...options,
  });
};
export const useResetPassword = (
  options?: UseMutationOptions<any, any, ResetPasswordData>,
) => {
  return useMutation<any, any, ResetPasswordData>({
    mutationFn: resetPassword,
    ...options,
  });
};
export const useLogout = (options?: UseMutationOptions<any, any, void>) => {
  return useMutation<any, any, void>({
    mutationFn: logout,
    ...options,
  });
};

export const useGetUserData = () => {
  return useQuery({
    queryKey: ["user-data"],
    queryFn: () => getUserData(),
  });
};
