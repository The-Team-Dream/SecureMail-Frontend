import React from "react";
import { StateMessage } from "@/_components/shared/StateMessage";
import notFoundImg from "@/../public/images/not-found.png";

interface EmptyMailboxProps {
  onAddAccount: () => void;
}

export function EmptyMailbox({ onAddAccount }: EmptyMailboxProps) {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[calc(100vh-160px)]">
      <StateMessage
        image={notFoundImg}
        title="Empty Mailbox"
        description="You don't have any accounts here, Please add new account by clicking on the below button"
        onRetry={onAddAccount}
        actionText="Add Mailbox"
      />
    </div>
  );
}
