"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectedAccounts } from "./_components/ConnectedAccounts";
import { AddAccountWizard } from "./_components/AddAccountWizard";
import { EmptyMailbox } from "./_components/EmptyMailbox";
import { useMailboxes } from "@/APIs/hooks/mailboxes";
import { ConnectedAccountsSkeleton } from "@/_components/skeleton/ConnectedAccountsSkeleton";

export default function Mailboxes() {
  const searchParams = useSearchParams();
  const { data: mailboxes, isLoading } = useMailboxes();
  const [view, setView] = useState<"list" | "add">("list");

  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      setView("add");
    }
  }, [searchParams]);

  if (isLoading) {
    return <ConnectedAccountsSkeleton />;
  }

  const hasAccounts = (mailboxes?.length ?? 0) > 0;

  return (
    <>
      {view === "list" && !hasAccounts && (
        <EmptyMailbox onAddAccount={() => setView("add")} />
      )}
      {view === "list" && hasAccounts && (
        <ConnectedAccounts onAddAccount={() => setView("add")} />
      )}
      {view === "add" && <AddAccountWizard onCancel={() => setView("list")} />}
    </>
  );
}
