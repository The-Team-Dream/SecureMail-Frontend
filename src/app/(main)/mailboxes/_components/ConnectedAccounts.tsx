"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Container from "@/_components/shared/Container";
import { useMailboxes, useSyncMailbox } from "@/APIs/hooks/mailboxes";
import { Mailbox } from "@/APIs/types/Mailbox";
import { StateMessage } from "@/_components/shared/StateMessage";
import notFoundImg from "@/../public/images/not-found.png";
import { ActionButton } from "@/_components/shared/ActionButton";
import { MailboxCard } from "./MailboxCard";
import { useSocketContext } from "@/utils/providers/SocketProvider";

interface ConnectedAccountsProps {
  onAddAccount: () => void;
}

export function ConnectedAccounts({ onAddAccount }: ConnectedAccountsProps) {
  const { data: mailboxes, isError, refetch } = useMailboxes();
  const { socket } = useSocketContext();
  const [syncingMailboxIds, setSyncingMailboxIds] = useState<string[]>([]);
  const syncMutation = useSyncMailbox();
  const syncMailbox = syncMutation.mutate;

  useEffect(() => {
    if (!socket) return;

    const handleSyncComplete = (data: any) => {
      const mailboxId = String(data.mailboxId ?? data.mailBoxId);
      setSyncingMailboxIds((prev) => prev.filter((id) => id !== mailboxId));
    };

    const handleSyncFailed = (data: any) => {
      const mailboxId = String(data.mailboxId ?? data.mailBoxId);
      setSyncingMailboxIds((prev) => prev.filter((id) => id !== mailboxId));
    };

    socket.on("mailbox_sync_complete", handleSyncComplete);
    socket.on("mailbox-sync-failed", handleSyncFailed);

    return () => {
      socket.off("mailbox_sync_complete", handleSyncComplete);
      socket.off("mailbox-sync-failed", handleSyncFailed);
    };
  }, [socket]);

  const handleSyncClick = (id: number) => {
    const idStr = id.toString();
    setSyncingMailboxIds((prev) => {
      if (prev.includes(idStr)) return prev;
      return [...prev, idStr];
    });

    syncMailbox(id, {
      onError: () => {
        setSyncingMailboxIds((prev) => prev.filter((mid) => mid !== idStr));
      },
    });
  };

  if (isError)
    return (
      <StateMessage
        variant="error"
        image={notFoundImg}
        title="Unable to Load Accounts"
        description="We're having trouble retrieving your connected mailboxes. This could be due to a temporary server issue or network connectivity."
        onRetry={() => refetch()}
        actionText="Try Again"
        className="h-screen"
      />
    );

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="flex justify-between items-center mb-8 w-full mt-2"
      >
        <div className="flex flex-col gap-1">
          <Text as="h2" size="3xl" font="semiBold">
            Connected Accounts
          </Text>
          <Text color="muted">
            You have Total {mailboxes?.length || 0} connected accounts
          </Text>
        </div>
        {/* Mobile: icon-only ActionButton */}
        <ActionButton
          icon={<Plus className="w-5 h-5 text-white" />}
          label="Add New Account"
          tooltipSide="left"
          onClick={onAddAccount}
          className="md:hidden h-10 w-10 bg-primary hover:bg-primary/90 rounded-full"
        />

        {/* Desktop: full labeled Button */}
        <Button size={"lg"} onClick={onAddAccount} className="hidden md:flex">
          <Plus className="w-4 h-4" />
          Add New Account
        </Button>
      </motion.div>

      <div className="bg-ghostBlue rounded-lg p-2 lg:py-6 lg:px-4 w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full items-end">
          {mailboxes?.map((acc: Mailbox, index: number) => (
            <MailboxCard
              key={acc.id}
              acc={acc}
              index={index}
              isSyncing={
                syncingMailboxIds.includes(acc.id.toString())
                  ? acc.id.toString()
                  : null
              }
              syncMailbox={handleSyncClick}
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
