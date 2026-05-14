import Link from "next/link";
import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { Plus, Wifi, WifiOff } from "lucide-react";
import Container from "@/_components/shared/Container";
import { useMailboxes, useSyncMailbox } from "@/APIs/hooks/mailboxes";
import { Mailbox } from "@/APIs/types/Mailbox";
import { Icons } from "@/constants/icons";
import { StateMessage } from "@/_components/shared/StateMessage";
import { Spinner } from "@/components/ui/spinner";
import { ProgressBar } from "@/_components/shared/ProgressBar";
import notFoundImg from "@/../public/images/not-found.png";

interface ConnectedAccountsProps {
  onAddAccount: () => void;
}

const getStatusStyles = (isActive: boolean) => {
  if (isActive) {
    return {
      color: "text-secondary-800",
      icon: <Wifi className="w-4 h-4" />,
      label: "Connected",
    };
  }
  return {
    color: "text-error-500",
    icon: <WifiOff className="w-4 h-4" />,
    label: "Disconnected",
  };
};

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
          {mailboxes?.map((acc: Mailbox, index: number) => {
            const statusStyles = getStatusStyles(acc.isActive);
            const totalThreats =
              (acc.spamScore ?? 0) +
              (acc.phishingScore ?? 0) +
              (acc.malwareScore ?? 0);
            return (
              <motion.div
                key={acc.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.15,
                  delay: index * 0.02,
                  ease: "easeOut",
                }}
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
                        <Text size="sm" font={"medium"}>
                          {acc.emailAddress}
                        </Text>
                        <Text size="xs">{acc.provider}</Text>
                      </div>
                    </div>
                    <div
                      className={`flex items-center gap-1.5 text-xs font-medium ${statusStyles.color} pt-1 shrink-0`}
                    >
                      {statusStyles.icon}
                      <span className="hidden md:block">
                        {statusStyles.label}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-col items-center flex-1">
                      <Text size="2xl" color={"info-700"} font="medium">
                        {acc._count?.emails}
                      </Text>
                      <Text size="xs" color={"primary-500"} className="mt-1">
                        Total Emails
                      </Text>
                    </div>
                    <div className="w-px h-10 bg-primary-100/60 shrink-0"></div>
                    <div className="flex flex-col items-center flex-1">
                      <Text size="2xl" color={"error-600"} font="semiBold">
                        {totalThreats}
                      </Text>
                      <Text size="xs" color={"primary-500"} className="mt-1">
                        Threats
                      </Text>
                    </div>
                    <div className="w-px h-10 bg-primary-100/60 shrink-0" />
                    <div className="flex flex-col items-center flex-1">
                      <Text size="xl" font="semiBold" color={"primary-800"}>
                        {acc.lastSyncedAt
                          ? new Date(acc.lastSyncedAt).toLocaleDateString()
                          : "Just now"}
                      </Text>
                      <Text size="xs" className="mt-1">
                        Last sync
                      </Text>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      disabled={isSyncing === acc.id.toString()}
                      variant="outline"
                      className="relative flex-1 rounded-lg border-primary text-sm gap-2 overflow-hidden"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        syncMailbox(acc.id);
                      }}
                    >
                      {/* Progress Background Overlay */}
                      {isSyncing === acc.id.toString() && (
                        <div className="absolute inset-0 z-0 flex items-center">
                          <ProgressBar
                            isLoading={isSyncing === acc.id.toString()}
                            className="bg-transparent rounded-lg"
                            barClassName="bg-primary-400/60"
                          />
                        </div>
                      )}

                      <div className="relative z-10 flex items-center justify-center gap-2 w-full">
                        {isSyncing === acc.id.toString() ? (
                          <>
                            Syncing...{" "}
                            <Spinner className="w-4 h-4 text-primary" />
                          </>
                        ) : (
                          <>
                            Sync{" "}
                            <Icons.Refresh className="w-4 h-4 text-primary stroke-2" />
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Container>
  );
}
