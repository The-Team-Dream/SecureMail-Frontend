import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../../features/userSettings";
import { toast } from "sonner";

export const useUpdateTheme = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateTheme,
    onMutate: async (newTheme) => {
      await queryClient.cancelQueries({ queryKey: ["user-settings"] });
      const previousSettings = queryClient.getQueryData(["user-settings"]);

      queryClient.setQueryData(["user-settings"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: { ...old?.data, themeMode: newTheme },
        };
      });

      return { previousSettings };
    },
    onError: (_err, _newTheme, context) => {
      queryClient.setQueryData(["user-settings"], context?.previousSettings);
      toast.error("Failed to update theme");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
};
