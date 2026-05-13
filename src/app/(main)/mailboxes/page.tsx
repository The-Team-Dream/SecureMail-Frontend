"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { useMailboxes } from "@/APIs/hooks/mailboxes";
import { ConnectedAccountsSkeleton } from "@/_components/skeleton/ConnectedAccountsSkeleton";

const ConnectedAccounts = dynamic(() => import("./_components/ConnectedAccounts").then((mod) => mod.ConnectedAccounts));
const AddAccountWizard = dynamic(() => import("./_components/AddAccountWizard").then((mod) => mod.AddAccountWizard));
const EmptyMailbox = dynamic(() => import("./_components/EmptyMailbox").then((mod) => mod.EmptyMailbox));

export default function Mailboxes() {
  const searchParams = useSearchParams();
  const { data: mailboxes, isLoading } = useMailboxes();
  
  // Initialize view properly from URL if reloading
  const initialStep = searchParams.get("step");
  const [view, setView] = useState<"list" | "add">(initialStep ? "add" : "list");

  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      setView("add");
    } else {
      setView("list");
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
