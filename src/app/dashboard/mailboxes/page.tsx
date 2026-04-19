"use client";

import React, { useState } from "react";
import { ConnectedAccounts } from "./_components/ConnectedAccounts";
import { AddAccountWizard } from "./_components/AddAccountWizard";

export default function Mailboxes() {
  const [view, setView] = useState<'list' | 'add'>('list');

  return (
    <>
      {view === 'list' && (
        <ConnectedAccounts onAddAccount={() => setView('add')} />
      )}
      {view === 'add' && (
        <AddAccountWizard onCancel={() => setView('list')} />
      )}
    </>
  );
}
