import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { forgetPassword } from "../../features/auth";
import { ForgetPasswordData, ForgetPasswordResponse } from "../../types/auth";

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
