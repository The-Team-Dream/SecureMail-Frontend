import { useMutation, useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";
import type { Email, Attachment } from "../../types/Email";

export const useSendEmail = (mailboxId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) =>
      emailsApi.sendEmail(mailboxId, formData),
    onMutate: async (formData: FormData) => {
      const idStr = String(mailboxId);
      const idNum = Number(mailboxId);

      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["emails", idStr] });
      await queryClient.cancelQueries({ queryKey: ["emails", idNum] });

      // Snapshot previous value
      const previousQueries = queryClient.getQueriesData<any>({
        queryKey: ["emails", idStr],
      });

      // Extract data from FormData
      const to = (formData.get("to") as string) || "";
      const subject = (formData.get("subject") as string) || "";
      const bodyText = (formData.get("bodyText") as string) || "";

      const attachedFiles = formData.getAll("attachments");
      const hasAttachments = attachedFiles.length > 0;
      const attachmentsList: Attachment[] = attachedFiles.map(
        (file: any, index: number) => ({
          id: `temp-att-${Date.now()}-${index}`,
          filename: file.name || "Attachment",
          size: file.size || 0,
          contentType: file.type || "",
        }),
      );

      const mockEmail: Email = {
        id: `temp-email-${Date.now()}`,
        mailBoxId: Number(mailboxId),
        subject,
        fromAddr: "",
        fromName: "",
        toAddr: to ? to.split(",").map((e) => e.trim()) : [],
        isRead: true,
        isFlagged: false,
        isSpam: false,
        isPhishing: false,
        receivedAt: new Date().toISOString(),
        spamScore: 0,
        phishingScore: 0,
        malwareVerdict: null,
        malwareScore: null,
        malwareSeverity: null,
        securityVerdict: "clean",
        folder: "sent",
        hasAttachments,
        attachments: attachmentsList,
      };

      // Optimistically update sent folder queries
      queryClient.setQueriesData<any>(
        { queryKey: ["emails", idStr, "sent"] },
        (old: any) => {
          if (!old) {
            return {
              data: [mockEmail],
              meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
            };
          }
          if (Array.isArray(old)) {
            return [mockEmail, ...old];
          }
          return {
            ...old,
            data: [mockEmail, ...(old.data || [])],
            meta: {
              ...(old.meta || {}),
              total: (old.meta?.total ?? 0) + 1,
            },
          };
        },
      );

      queryClient.setQueriesData<any>(
        { queryKey: ["emails", idNum, "sent"] },
        (old: any) => {
          if (!old) {
            return {
              data: [mockEmail],
              meta: { total: 1, page: 1, limit: 20, totalPages: 1 },
            };
          }
          if (Array.isArray(old)) {
            return [mockEmail, ...old];
          }
          return {
            ...old,
            data: [mockEmail, ...(old.data || [])],
            meta: {
              ...(old.meta || {}),
              total: (old.meta?.total ?? 0) + 1,
            },
          };
        },
      );

      return { previousQueries };
    },
    onSuccess: () => {
      toast.success("Email sent successfully");
    },
    onError: (error: any, _variables, context) => {
      toast.error(error?.message || "Failed to send email");
      if (context?.previousQueries) {
        context.previousQueries.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },
    onSettled: () => {
      const idStr = String(mailboxId);
      const idNum = Number(mailboxId);
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["emails", idStr] });
        queryClient.invalidateQueries({ queryKey: ["emails", idNum] });
        queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
        queryClient.invalidateQueries({ queryKey: ["analytics"] });
      }, 2000);
    },
  });
};
