import { useMutation, useQueryClient } from '@tanstack/react-query';
import { settingsApi } from '../features/userSettings';

export const useSettingsOperations = () => {
  const queryClient = useQueryClient();

  const themeMutation = useMutation({
    mutationFn: settingsApi.updateTheme,
    onMutate: async (newTheme) => {
      await queryClient.cancelQueries({ queryKey: ['user-settings'] });
      const previousSettings = queryClient.getQueryData(['user-settings']);

      queryClient.setQueryData(['user-settings'], (old: any) => ({
        ...old,
        data: { ...old.data, themeMode: newTheme }
      }));

      return { previousSettings };
    },
    onError: (err, newTheme, context) => {
      queryClient.setQueryData(['user-settings'], context?.previousSettings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
  });
  // Profile Mutation
  const profileMutation = useMutation({
    mutationFn: settingsApi.updateProfile,
    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: ['user-settings'] });
      const previousSettings = queryClient.getQueryData(['user-settings']);

      const newUsername = formData.get('username') as string;
      const avatarFile = formData.get('avatar') as File;
      
      const tempAvatarUrl = avatarFile ? URL.createObjectURL(avatarFile) : null;

      queryClient.setQueryData(['user-settings'], (old: any) => ({
        ...old,
        data: { 
          ...old.data, 
          username: newUsername || old.data.username,
          avatarUrl: tempAvatarUrl || old.data.avatarUrl 
        }
      }));

      return { previousSettings };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['user-settings'], context?.previousSettings);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['user-settings'] });
    },
  });

  return {
    updateTheme: themeMutation.mutate,
    updateProfile: profileMutation.mutate,
    isUpdating: profileMutation.isPending || themeMutation.isPending,
  };
};