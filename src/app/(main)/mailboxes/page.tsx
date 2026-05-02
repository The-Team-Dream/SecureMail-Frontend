"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ConnectedAccounts } from "./_components/ConnectedAccounts";
import { AddAccountWizard } from "./_components/AddAccountWizard";
import { EmptyMailbox } from "./_components/EmptyMailbox";
import { WizardFormData } from "../../../schemas/CustomAccount";
import { Mailbox, MailboxProvider } from "@/APIs/types/Mailbox";
import { useMailboxes } from "@/APIs/hooks/useMailboxes";

const LOCAL_ACCOUNTS_KEY = "securemail_local_accounts";

export default function Mailboxes() {
  const searchParams = useSearchParams();
  const { data: mailboxes } = useMailboxes();
  const [view, setView] = useState<"list" | "add">("list");
  const [accounts, setAccounts] = useState<Mailbox[]>([]);

  useEffect(() => {
    const localAccounts = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const parsedLocal = localAccounts ? JSON.parse(localAccounts) : [];

    if (mailboxes) {
      // Merge API mailboxes with local ones, avoiding duplicates by ID
      const apiIds = new Set(mailboxes.map((m) => m.id));
      const filteredLocal = parsedLocal.filter(
        (m: Mailbox) => !apiIds.has(m.id),
      );
      setAccounts([...mailboxes, ...filteredLocal]);
    } else {
      setAccounts(parsedLocal);
    }
  }, [mailboxes]);

  useEffect(() => {
    const step = searchParams.get("step");
    if (step) {
      setView("add");
    }
  }, [searchParams]);

  const hasAccounts = accounts.length > 0;

  const normalizeProvider = (provider: string): MailboxProvider => {
    switch (provider) {
      case "Gmail":
        return "GMAIL";
      case "Outlook":
        return "OUTLOOK";
      case "Custom IMAP":
        return "IMAP";
      default:
        return "IMAP";
    }
  };

  const handleAccountAdded = (data: WizardFormData, provider: string) => {
    const newAccount: Mailbox = {
      id: Date.now().toString(),
      email: data.emailAddress || data.mailboxName,
      displayName: data.mailboxName,
      provider: normalizeProvider(provider),
      totalEmails: 0,
      threatsCount: 0,
      lastSync: "Just now",
      status: "connected",
      pushNotificationsEnabled: true,
    };

    const updatedAccounts = [newAccount, ...accounts];
    setAccounts(updatedAccounts);

    // Save to localStorage (only the ones not from API would be ideal, but for now we save all)
    // To be safer, we only save the "local" ones
    const localAccounts = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    const parsedLocal = localAccounts ? JSON.parse(localAccounts) : [];
    localStorage.setItem(
      LOCAL_ACCOUNTS_KEY,
      JSON.stringify([newAccount, ...parsedLocal]),
    );

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
