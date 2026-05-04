import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import {
  forgetPassword,
  signin,
  signup,
  resetPassword,
  verifyOtp,
  resendOtp,
  logout,
  getOAuthLoginUrl,
  validateOAuthToken,
  getAuthMe,
} from "../features/auth";
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
  ForgetPasswordResponse,
} from "../types/auth";

export const useSignup = (
  options?: UseMutationOptions<SignupResponse, AxiosError, SignupData>,
) => {
  const queryClient = useQueryClient();
  return useMutation<SignupResponse, AxiosError, SignupData>({
    mutationFn: signup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};

export const useSignin = (
  options?: UseMutationOptions<SigninResponse, AxiosError, SigninData>,
) => {
  const queryClient = useQueryClient();
  return useMutation<SigninResponse, AxiosError, SigninData>({
    mutationFn: signin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};

export const useVerifyOtp = (
  options?: UseMutationOptions<VerifyOtpResponse, AxiosError, VerifyOtpData>,
) => {
  const queryClient = useQueryClient();
  return useMutation<VerifyOtpResponse, AxiosError, VerifyOtpData>({
    mutationFn: verifyOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};
export const useResendOtp = (
  options?: UseMutationOptions<VerifyOtpResponse, AxiosError, ResendOtpData>,
) => {
  const queryClient = useQueryClient();
  return useMutation<VerifyOtpResponse, AxiosError, ResendOtpData>({
    mutationFn: resendOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};
export const useForgetPassword = (
  options?: UseMutationOptions<
    ForgetPasswordResponse,
    AxiosError,
    ForgetPasswordData
  >,
) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, ForgetPasswordData>({
    mutationFn: forgetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};
export const useResetPassword = (
  options?: UseMutationOptions<any, AxiosError, ResetPasswordData>,
) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, ResetPasswordData>({
    mutationFn: resetPassword,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};
export const useLogout = (
  options?: UseMutationOptions<any, AxiosError, void>,
) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, void>({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};

export const useGetAuthMe = () => {
  return useQuery({
    queryKey: ["auth-me"],
    queryFn: () => getAuthMe(),
  });
};
