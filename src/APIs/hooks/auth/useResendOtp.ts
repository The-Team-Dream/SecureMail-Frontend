import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { resendOtp } from "../../features/auth";
import { ResendOtpData } from "../../types/auth";

export const useResendOtp = (
  options?: UseMutationOptions<any, AxiosError, ResendOtpData>,
) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, ResendOtpData>({
    mutationFn: resendOtp,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};
