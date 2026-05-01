"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  ConnectedAccounts,
  mockAccounts,
  ConnectedAccountType,
} from "./_components/ConnectedAccounts";
import { AddAccountWizard } from "./_components/AddAccountWizard";
import { EmptyMailbox } from "./_components/EmptyMailbox";
import { WizardFormData } from "../../../schemas/CustomAccount";

export default function Mailboxes() {
  const searchParams = useSearchParams();
  const [view, setView] = useState<"list" | "add">("list");
  const [accounts, setAccounts] =
    useState<ConnectedAccountType[]>(mockAccounts);

  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      setView("add");
    }
  }, [searchParams]);
  const hasAccounts = accounts.length > 0;

  const handleAccountAdded = (data: WizardFormData, provider: string) => {
    const newAccount: ConnectedAccountType = {
      id: Date.now(),
      email: data.emailAddress || data.mailboxName,
      provider: provider,
      emails: "0",
      threats: "0",
      sync: data.syncInterval ? `${data.syncInterval} Min` : "Not Set",
      syncLabel: "ago",
      status: "Connected",
      statusColor: "text-secondary-800",
      icon: "wifi",
    };
    setAccounts([newAccount, ...accounts]);
    setView("list");
  };

  return (
    <>
      {view === "list" && !hasAccounts && (
        <EmptyMailbox onAddAccount={() => setView("add")} />
      )}
      {view === "list" && hasAccounts && (
        <ConnectedAccounts
          accounts={accounts}
          onAddAccount={() => setView("add")}
        />
      )}
      {view === "add" && (
        <AddAccountWizard
          onCancel={() => setView("list")}
          onSuccess={handleAccountAdded}
        />
      )}
    </>
  );
}
