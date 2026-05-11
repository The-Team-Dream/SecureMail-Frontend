import { useMutation, UseMutationOptions, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { verifyOtp } from "../../features/auth";
import { VerifyOtpData, VerifyOtpResponse } from "../../types/auth";

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
