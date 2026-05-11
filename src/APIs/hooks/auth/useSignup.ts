import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { signup } from "../../features/auth";
import { SignupData, SignupResponse } from "../../types/auth";

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
