import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsApi } from "../features/userSettings";

export const useSettingsOperations = () => {
  const queryClient = useQueryClient();

  const themeMutation = useMutation({
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
    onError: (err, newTheme, context) => {
      queryClient.setQueryData(["user-settings"], context?.previousSettings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["user-settings"] });
    },
  });
  // Profile Mutation
  const profileMutation = useMutation({
    mutationFn: settingsApi.updateProfile,
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ["user-settings"] });
      const previousSettings = queryClient.getQueryData(["user-settings"]);

      const newUsername = formData.get("username") as string;
      const avatarFile = formData.get("avatar") as File;

      const tempAvatarUrl =
        avatarFile instanceof Blob || avatarFile instanceof File
          ? URL.createObjectURL(avatarFile)
          : null;

      queryClient.setQueryData(["user-settings"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: {
            ...old?.data,
            username: newUsername || old?.data?.username,
            avatarUrl: tempAvatarUrl || old?.data?.avatarUrl,
          },
        };
      });

      await queryClient.cancelQueries({ queryKey: ["auth-me"] });
      const previousAuthMe = queryClient.getQueryData(["auth-me"]);

      queryClient.setQueryData(["auth-me"], (old: any) => {
        if (!old) return old;
        // Handle both possible structures: { user: {...} } or {...}
        if (old.user) {
          return {
            ...old,
            user: {
              ...old.user,
              username: newUsername || old.user.username,
              avatar: tempAvatarUrl || old.user.avatar,
            },
          };
        }
        return {
          ...old,
          username: newUsername || old.username,
          avatar: tempAvatarUrl || old.avatar,
        };
      });

      return { previousSettings, previousAuthMe };
    },
    onError: (err, variables, context: any) => {
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
          data: {
            ...(old?.data ?? old),
            ...(newUsername && { username: newUsername }),
            ...(newAvatar !== undefined && { avatarUrl: newAvatar }),
          },
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
    },
  });

  // Change Password Mutation
  const passwordMutation = useMutation({
    mutationFn: settingsApi.changePassword,
  });

  return {
    updateTheme: themeMutation.mutate,
    updateProfile: profileMutation.mutate,
    isUpdating: profileMutation.isPending || themeMutation.isPending,
    changePassword: passwordMutation.mutate,
    isChangingPassword: passwordMutation.isPending,
  };
};
