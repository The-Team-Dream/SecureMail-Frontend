import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  AuthError,
  signin,
  signinPayload,
  SigninResponse,
  signup,
  signupPayload,
  SignupResponse,
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
