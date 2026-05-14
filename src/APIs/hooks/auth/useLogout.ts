import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { logout } from "../../features/auth";
import { disconnectSocket } from "@/lib/socket";

export const useLogout = (
  options?: UseMutationOptions<any, AxiosError, void>,
) => {
  const queryClient = useQueryClient();
  return useMutation<any, AxiosError, void>({
    mutationFn: logout,
    onSuccess: () => {
      disconnectSocket();
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
    ...options,
  });
};
