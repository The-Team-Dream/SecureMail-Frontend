import React from "react";
import Link from "next/link";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import {
  Mail,
  RefreshCw,
  Shield,
  Loader,
  Wifi,
  WifiOff,
  Search,
  CircleX,
} from "lucide-react";
import Container from "@/_components/shared/Container";
import { Input } from "@/_components/shared/Input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMailboxes, useMailboxOperations } from "@/APIs/hooks/useMailboxes";
import { Mailbox } from "@/APIs/types/Mailbox";
import { AccountCardSkeleton } from "@/_components/skeleton/AccountCardSkeleton";
import { ConnectedAccountsSkeleton } from "@/_components/skeleton/ConnectedAccountsSkeleton";

export interface ConnectedAccountType {
  id: number;
  email: string;
  provider: string;
  emails: string;
  threats: string;
  sync: string;
  syncLabel: string;
  status: string;
  statusColor: string;
  icon: string;
}

export const mockAccounts: ConnectedAccountType[] = [
  {
    id: 1,
    email: "mohamedhasabelnaby@gmail.com",
    provider: "Google",
    emails: "12,450",
    threats: "23",
    sync: "2 Min",
    syncLabel: "ago",
    status: "Connected",
    statusColor: "text-secondary-800",
    icon: "wifi",
  },
  {
    id: 2,
    email: "mohamedMostafa23@hotmail.com",
    provider: "Hotmail",
    emails: "11,600",
    threats: "15",
    sync: "2 Days",
    syncLabel: "ago",
    status: "Connected",
    statusColor: "text-secondary-800",
    icon: "wifi",
  },
  {
    id: 3,
    email: "mohamedhasabelnaby@gmail.com",
    provider: "Custom IMAP",
    emails: "13,050",
    threats: "9",
    sync: "Syncing...",
    syncLabel: "",
    status: "",
    statusColor: "text-primary-400",
    icon: "loader",
  },
  {
    id: 4,
    email: "Personal@Proton.me",
    provider: "ProtonMail",
    emails: "12,325",
    threats: "2",
    sync: "5 Min",
    syncLabel: "ago",
    status: "DisConnected",
    statusColor: "text-error-500",
    icon: "wifioff",
  },
];

interface ConnectedAccountsProps {
  accounts: ConnectedAccountType[];
  onAddAccount: () => void;
}

export function ConnectedAccounts({
  accounts,
  onAddAccount,
}: ConnectedAccountsProps) {
  const { data: mailboxes, isLoading, isError } = useMailboxes();
  const { deleteMailbox, syncMailbox, isDeleting } = useMailboxOperations();

  // if (isLoading) {
  //   return <ConnectedAccountsSkeleton />;
  // }

  if (isError) return 
    <Text size={'2xl'} color="error-600" className="flex items-center gap-2"><CircleX className="w-24 h-24" /> loading mailboxes...</Text>
  return (
    <Container>
      <div className="flex justify-between items-center mb-8 w-full mt-2">
        <div className="flex flex-col gap-1">
          <Text as="h2" size="3xl" font="semiBold">
            Connected Accounts
          </Text>
          <Text color={"primary-400"}>
            You have Total {accounts.length} connected accounts
          </Text>
        </div>
        <Button
          className="w-auto bg-primary-900 text-primary-50 hover:bg-primary-800 rounded-[12px] px-6 h-11 font-medium transition-all"
          onClick={onAddAccount}
        >
          Add New Account +
        </Button>
      </div>

      <div className="bg-ghostBlue rounded-lg p-2 lg:py-6 lg:px-4  w-full">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 w-full">
          {accounts.map((acc) => (
            <Link
              href={`/mailbox/inbox/${acc.id}`}
              key={acc.id}
              className="bg-background border hover:scale-101 transition-all duration-100 hover:bg-background/20 border-primary-100/60 rounded-lg py-6 px-8 flex flex-col gap-8 shadow-[0_4px_16px_rgba(223, 223, 223, 0.5)] transition-all hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] cursor-pointer"
            >
              {/* Header Section */}
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4 min-w-0 flex-1 pr-4">
                  <div className="w-[46px] h-[46px] min-w-[46px] rounded-full bg-primary-50 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-primary-900 stroke-[1.5]" />
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
                  className={`flex items-center gap-1.5 text-xs font-medium ${acc.statusColor} pt-1 shrink-0`}
                >
                  {acc.icon === "loader" && (
                    <Loader className="w-4 h-4 text-primary-400 animate-spin" />
                  )}
                  {acc.icon === "wifi" && <Wifi className="w-4 h-4" />}
                  {acc.icon === "wifioff" && <WifiOff className="w-4 h-4" />}
                  {acc.status}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center flex-1">
                  <Text size="2xl" color={"info-700"} font="medium">
                    {acc.emails}
                  </Text>
                  <Text size="xs" color={"primary-500"} className="mt-1">
                    Total Emails
                  </Text>
                </div>

                <div className="w-px h-12 bg-primary-200"></div>

                <div className="flex flex-col items-center flex-1">
                  <Text size="2xl" color={"error-600"} font="semiBold">
                    {acc.threats}
                  </Text>
                  <Text size="xs" color={"primary-500"} className="mt-1">
                    Threats
                  </Text>
                </div>

                <div className="w-px h-12 bg-primary-200"></div>

                <div className="flex flex-col items-center flex-1">
                  {acc.sync === "Syncing..." ? (
                    <Text size="xl" color={"primary-800"} font="bold">
                      Syncing...
                    </Text>
                  ) : (
                    <Text size="xl" font="semiBold" color={"primary-800"}>
                      {acc.sync}{" "}
                      <span className="text-sm">{acc.syncLabel}</span>
                    </Text>
                  )}
                  <Text size="xs" className="mt-1">
                    Last sync
                  </Text>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  disabled={acc.sync === "Syncing..."}
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
                    }}
                  >
                    Sync <RefreshCw className="w-4 h-4 text-primary stroke-2" />
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 rounded-lg h-[36px] border-primary text-sm gap-2"
                  asChild
                >
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    Scan <Shield className="w-4 h-4 text-primary stroke-2" />
                  </div>
                </Button>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Container>
  );
}
