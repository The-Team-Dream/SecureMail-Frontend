import { useQueryClient } from "@tanstack/react-query";
import { emailsApi } from "../../features/emails";
import { toast } from "sonner";
import type { EmailFolder } from "../../types/Email";

export const useDeleteEmailWithUndo = (
  mailboxId: string,
  currentFolder?: EmailFolder,
) => {
  const queryClient = useQueryClient();

  return (id: string) => {
    let isUndone = false;

    // 1. Capture previous state for rollback/undo
    const previousQueries = queryClient.getQueriesData<any>({
      queryKey: ["emails", mailboxId],
    });

    // 2. Optimistically remove from UI
    queryClient.setQueriesData<any>(
      { queryKey: ["emails", mailboxId] },
      (old: any) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.filter((e: any) => String(e.id) !== String(id)),
        };
      },
    );

    // 3. Show Toast with Action
    toast.success("Email moved to trash", {
      action: {
        label: "Undo",
        onClick: () => {
          isUndone = true;
          // Rollback UI
          previousQueries.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
          toast.success("Action undone");
        },
      },
      duration: 5000,
    });

    // 4. Wait for toast duration before firing API (simulating real undo window)
    // In a simpler version, we just fire it and revert if undone was clicked.
    // But since API might have fired already, we check isUndone.
    
    setTimeout(async () => {
      if (isUndone) return;

      try {
        if (currentFolder === "trash") {
          await emailsApi.deleteEmail(mailboxId, id);
        } else {
          await emailsApi.reclassify(mailboxId, id, "trash");
        }
      } catch (error) {
        if (!isUndone) {
          // Revert on real error
          previousQueries.forEach(([queryKey, data]) => {
            queryClient.setQueryData(queryKey, data);
          });
          toast.error("Failed to delete email");
        }
      }
    }, 5000);
  };
};
