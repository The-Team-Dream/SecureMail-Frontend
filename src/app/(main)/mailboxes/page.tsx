"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectedAccounts } from "./_components/ConnectedAccounts";
import { AddAccountWizard } from "./_components/AddAccountWizard";
import { EmptyMailbox } from "./_components/EmptyMailbox";
import { useMailboxes } from "@/APIs/hooks/useMailboxes";
import { Spinner } from "@/components/ui/spinner";

export default function Mailboxes() {
  const searchParams = useSearchParams();
  const { data: mailboxes, isLoading } = useMailboxes();
  const [view, setView] = useState<"list" | "add">("list");

  // If the URL has a ?step= param, go straight to the wizard
  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      setView("add");
    }
  }, [searchParams]);

  // While loading show a spinner so we don't flash the EmptyMailbox view
  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <Spinner />
      </div>
    );
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
      {view === "add" && (
        <AddAccountWizard
          onCancel={() => setView("list")}
          // onSuccess is now API-driven — wizard handles success internally
        />
      )}
    </>
  );
}