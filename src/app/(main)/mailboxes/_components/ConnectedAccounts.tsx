"use client";

import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Container from "@/_components/shared/Container";
import { useMailboxes, useSyncMailbox } from "@/APIs/hooks/mailboxes";
import { Mailbox } from "@/APIs/types/Mailbox";
import { StateMessage } from "@/_components/shared/StateMessage";
import notFoundImg from "@/../public/images/not-found.png";
import { MailboxCard } from "./MailboxCard";

interface ConnectedAccountsProps {
  onAddAccount: () => void;
}

export function ConnectedAccounts({ onAddAccount }: ConnectedAccountsProps) {
  const { data: mailboxes, isError, refetch } = useMailboxes();
  const syncMutation = useSyncMailbox();
  const syncMailbox = syncMutation.mutate;
  const isSyncing = syncMutation.isPending
    ? syncMutation.variables?.toString()
    : null;

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
          <Text color={"primary-400"}>
            You have Total {mailboxes?.length || 0} connected accounts
          </Text>
        </div>
        <Button size={"lg"} onClick={onAddAccount}>
          <Plus className="w-4 h-4" />
          <span className="hidden md:block">Add New Account</span>
        </Button>
      </motion.div>

      <div className="bg-ghostBlue rounded-lg p-2 lg:py-6 lg:px-4  w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
          {mailboxes?.map((acc: Mailbox, index: number) => (
            <MailboxCard 
              key={acc.id} 
              acc={acc} 
              index={index} 
              isSyncing={isSyncing} 
              syncMailbox={syncMailbox} 
            />
          ))}
        </div>
      </div>
    </Container>
  );
}
