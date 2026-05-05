import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Loader, Wifi, WifiOff } from "lucide-react";
import Container from "@/_components/shared/Container";
import { useMailboxes, useMailboxOperations } from "@/APIs/hooks/useMailboxes";
import { Mailbox } from "@/APIs/types/Mailbox";
import { ConnectedAccountsSkeleton } from "@/_components/skeleton/ConnectedAccountsSkeleton";
import { Icons } from "@/constants/icons";
import { StateMessage } from "@/_components/shared/StateMessage";

interface ConnectedAccountsProps {
  accounts: Mailbox[];
  onAddAccount: () => void;
}

const getStatusStyles = (status: Mailbox["status"]) => {
  switch (status) {
    case "connected":
      return {
        color: "text-secondary-800",
        icon: <Wifi className="w-4 h-4" />,
        label: "Connected",
      };
    case "disconnected":
      return {
        color: "text-error-500",
        icon: <WifiOff className="w-4 h-4" />,
        label: "Disconnected",
      };
    case "syncing":
      return {
        color: "text-primary-400",
        icon: <Loader className="w-4 h-4 text-primary-400 animate-spin" />,
        label: "Syncing",
      };
    case "error":
      return {
        color: "text-error-600",
        icon: <Icons.Delete className="w-4 h-4" />,
        label: "Error",
      };
    default:
      return {
        color: "text-primary-400",
        icon: <Loader className="w-4 h-4 animate-spin" />,
        label: "Unknown",
      };
  }
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100 },
  },
};

export function ConnectedAccounts({
  accounts,
  onAddAccount,
}: ConnectedAccountsProps) {
  const { data: mailboxes, isLoading, isError, refetch } = useMailboxes();
  const { syncMailbox } = useMailboxOperations();

  // if (isLoading) {
  //   return <ConnectedAccountsSkeleton />;
  // }

  // if (isError)
  //   return (
  //     <StateMessage
  //       variant="error"
  //       title="Failed to load mailboxes"
  //       description="Failed to load mailboxes"
  //       onRetry={() => refetch()}
  //       className="h-screen"
  //     />
  //   );
  return (
    <Container>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-between items-center mb-8 w-full mt-2"
      >
        <div className="flex flex-col gap-1">
          <Text as="h2" size="3xl" font="semiBold">
            Connected Accounts
          </Text>
          <Text color={"primary-400"}>
            You have Total {accounts.length} connected accounts
          </Text>
        </div>
        <Button
          size={"lg"}
          className="w-auto rounded-xl font-medium"
          onClick={onAddAccount}
        >
          Add New Account +
        </Button>
      </motion.div>

      <div className="bg-ghostBlue rounded-lg p-2 lg:py-6 lg:px-4  w-full">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full"
        >
          {accounts.map((acc) => {
            const statusStyles = getStatusStyles(acc.status);
            return (
              <motion.div
                key={acc.id}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Link
                  href={`/mailboxes/${acc.id}/inbox`}
                  className="bg-background border border-primary-100/60 rounded-lg py-6 px-8 flex flex-col gap-8 shadow-[0_4px_16px_rgba(223, 223, 223, 0.5)] transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer hover:border-primary-200"
                >
                  {/* Header Section */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                      <div className="w-[46px] h-[46px] min-w-[46px] rounded-full bg-primary-50 flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                        <Icons.Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                        <div className="truncate w-full">
                          <Text
                            size="sm"
                            font="semiBold"
                            className="tracking-tight truncate w-full block"
                          >
                            {acc.email}
                          </Text>
                        </div>
                        <Text size="xs">{acc.provider}</Text>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${statusStyles.color} pt-1 shrink-0`}
                    >
                      {statusStyles.icon}
                      {statusStyles.label}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center flex-1">
                      <Text size="2xl" color={"info-700"} font="medium">
                        {acc.totalEmails.toLocaleString()}
                      </Text>
                      <Text size="xs" color={"primary-500"} className="mt-1">
                        Total Emails
                      </Text>
                    </div>

                    <div className="w-px h-12 bg-primary-200" />

                    <div className="flex flex-col items-center flex-1">
                      <Text size="2xl" color={"error-600"} font="semiBold">
                        {acc.threatsCount.toLocaleString()}
                      </Text>
                      <Text size="xs" color={"primary-500"} className="mt-1">
                        Threats
                      </Text>
                    </div>
                    <div className="w-px h-12 bg-primary-200" />

                    <div className="flex flex-col items-center flex-1">
                      <Text size="xl" font="semiBold" color={"primary-800"}>
                        {acc.lastSync}
                      </Text>
                      <Text size="xs" className="mt-1">
                        Last sync
                      </Text>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      disabled={acc.status === "syncing"}
                      variant="outline"
                      className="flex-1 rounded-lg border-primary text-sm gap-2"
                      asChild
                    >
                      <div
                        role="button"
                        tabIndex={0}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          syncMailbox(acc.id);
                        }}
                      >
                        Sync{" "}
                        <Icons.Refresh className="w-4 h-4 text-primary stroke-2" />
                      </div>
                    </Button>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </Container>
  );
}
