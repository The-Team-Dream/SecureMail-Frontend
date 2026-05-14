import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { resetPassword } from "../../features/auth";
import { ResetPasswordData } from "../../types/auth";

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
