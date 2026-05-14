import { useMutation } from "@tanstack/react-query";
import { settingsApi } from "../../features/userSettings";
import { toast } from "sonner";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: settingsApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (err: any) => {
      console.error(err.response?.data?.message || "Failed to change password");
    },
  });
};
