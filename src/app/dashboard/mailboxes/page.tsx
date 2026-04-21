"use client";

import React, { useState } from "react";
import { ConnectedAccounts } from "./_components/ConnectedAccounts";
import { AddAccountWizard } from "./_components/AddAccountWizard";
import { EmptyMailbox } from "./_components/EmptyMailbox";

export default function Mailboxes() {
  const [view, setView] = useState<'list' | 'add'>('list');
  const [hasAccounts, setHasAccounts] = useState(false);

  const handleAccountAdded = () => {
    setHasAccounts(true);
    setView('list');
  };

  return (
    <>
      {view === 'list' && !hasAccounts && (
        <EmptyMailbox onAddAccount={() => setView('add')} />
      )}
      {view === 'list' && hasAccounts && (
        <ConnectedAccounts onAddAccount={() => setView('add')} />
      )}
      {view === 'add' && (
        <AddAccountWizard onCancel={() => setView('list')} onSuccess={handleAccountAdded} />
      )}
    </>
  );
}
