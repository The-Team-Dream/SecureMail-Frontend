import { useQuery } from "@tanstack/react-query";
import { fetchAuthenticatedImage } from "@/APIs/features/emails/fetchAuthenticatedImage";

export const useAuthenticatedImage = (url: string) => {
  return useQuery({
    queryKey: ["attachment-image", url],
    queryFn: () => fetchAuthenticatedImage(url),
    staleTime: Infinity,
    enabled: !!url,
  });
};
