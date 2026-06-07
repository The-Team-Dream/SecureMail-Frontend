import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../../features/userSettings";
import { toast } from "sonner";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: settingsApi.updateProfile,
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ["user-settings"] });
      const previousSettings = queryClient.getQueryData(["user-settings"]);

      const newUsername = formData.get("username") as string;
      const avatarFile = formData.get("avatar");

      const tempAvatarUrl =
        avatarFile && typeof avatarFile !== "string"
          ? URL.createObjectURL(avatarFile)
          : null;

      const isAvatarDeleted = avatarFile === "";

      queryClient.setQueryData(["user-settings"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          username: newUsername || old?.username,
          avatarUrl: isAvatarDeleted ? null : tempAvatarUrl || old?.avatarUrl,
        };
      });

      await queryClient.cancelQueries({ queryKey: ["auth-me"] });
      const previousAuthMe = queryClient.getQueryData(["auth-me"]);

      queryClient.setQueryData(["auth-me"], (old: any) => {
        if (!old) return old;
        if (old.user) {
          return {
            ...old,
            user: {
              ...old.user,
              username: newUsername || old.user.username,
              avatar: isAvatarDeleted ? null : tempAvatarUrl || old.user.avatar,
            },
          };
        }
        return {
          ...old,
          username: newUsername || old.username,
          avatar: isAvatarDeleted ? null : tempAvatarUrl || old.avatar,
        };
      });

      return { previousSettings, previousAuthMe };
    },
    onError: (_err, _variables, context: any) => {
      queryClient.setQueryData(["user-settings"], context?.previousSettings);
      queryClient.setQueryData(["auth-me"], context?.previousAuthMe);
    },
    onSuccess: (data) => {
      const newAvatar =
        data?.avatarUrl ?? data?.avatar ?? data?.user?.avatar ?? null;
      const newUsername = data?.username ?? data?.user?.username ?? null;

      queryClient.setQueryData(["user-settings"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          ...(newUsername && { username: newUsername }),
          ...(newAvatar !== undefined && { avatarUrl: newAvatar }),
        };
      });

      queryClient.setQueryData(["auth-me"], (old: any) => {
        if (!old) return old;
        if (old.user) {
          return {
            ...old,
            user: {
              ...old.user,
              ...(newUsername && { username: newUsername }),
              ...(newAvatar !== undefined && { avatar: newAvatar }),
            },
          };
        }
        return {
          ...old,
          ...(newUsername && { username: newUsername }),
          ...(newAvatar !== undefined && { avatar: newAvatar }),
        };
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
      queryClient.invalidateQueries({ queryKey: ["auth-me"] });
    },
  });
};
