import { useQuery } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";

export const useMailboxById = (id: number | string) => {
  return useQuery({
    queryKey: ["mailboxes", id],
    queryFn: () => mailboxApi.getMailboxById(Number(id)),
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
