"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/_components/shared/Text";
import { toast } from "sonner";
import { mailboxApi } from "@/APIs/features/mailboxes";
import { useQueryClient } from "@tanstack/react-query";

export default function MailboxCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;

    const code = searchParams.get("code");
    const state = searchParams.get("state"); // "google" | "outlook"
    const error = searchParams.get("error");

    if (error) {
      toast.error("OAuth connection was cancelled or failed.");
      router.replace("/mailboxes?step=1");
      return;
    }

    if (!code) {
      toast.error("No authorization code received.");
      router.replace("/mailboxes?step=1");
      return;
    }

    processed.current = true;

    const handleConnect = async () => {
      const redirectUri = `${window.location.origin}/mailboxes/callback`;
      try {
        if (state === "outlook") {
          await mailboxApi.connectOutlook(code, redirectUri);
          toast.success("Outlook connected successfully!");
        } else {
          // Default to Gmail
          await mailboxApi.connectGmail(code, redirectUri);
          toast.success("Gmail connected successfully!");
        }
        // Invalidate the mailboxes cache so the list refreshes
        await queryClient.invalidateQueries({ queryKey: ["mailboxes"] });
        router.replace("/mailboxes");
      } catch (err: any) {
        const message =
          err?.response?.data?.message ||
          err?.message ||
          "Failed to connect mailbox. Please try again.";
        toast.error(message);
        router.replace("/mailboxes?step=1");
      }
    };

    handleConnect();
  }, [searchParams, router, queryClient]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-background">
      <Spinner />
      <Text font="medium" color="primary-950" size="lg">
        Connecting your mailbox...
      </Text>
      <Text size="sm" color="primary-400">
        Please wait while we finalize the connection.
      </Text>
    </div>
  );
}
