import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { signin } from "../../features/auth";
import { SigninData, SigninResponse } from "../../types/auth";

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
