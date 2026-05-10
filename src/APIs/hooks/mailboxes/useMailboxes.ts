import { useQuery } from "@tanstack/react-query";
import { mailboxApi } from "../../features/mailboxes";

export const useMailboxes = () => {
  return useQuery({
    queryKey: ["mailboxes"],
    queryFn: mailboxApi.getMailboxes,
  });
};
