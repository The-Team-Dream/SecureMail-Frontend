"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import { useMailboxes } from "@/APIs/hooks/mailboxes";
import { ConnectedAccountsSkeleton } from "@/_components/skeleton/ConnectedAccountsSkeleton";

const EmptyMailbox = dynamic(() =>
  import("./_components/EmptyMailbox").then((mod) => mod.EmptyMailbox),
);
const ConnectedAccounts = dynamic(() =>
  import("./_components/ConnectedAccounts").then(
    (mod) => mod.ConnectedAccounts,
  ),
);
const AddAccountWizard = dynamic(() =>
  import("./_components/AddAccountWizard").then(
    (mod) => mod.AddAccountWizard,
  ),
);

export default function Mailboxes() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { data: mailboxes, isLoading } = useMailboxes();

  const step = searchParams.get("step");
  const view = step ? "add" : "list";

  if (isLoading) {
    return <ConnectedAccountsSkeleton />;
  }

  const hasAccounts = (mailboxes?.length ?? 0) > 0;

  const handleAddAccount = () => {
    router.push(`${pathname}?step=1`);
  };

  const handleCancel = () => {
    router.push(pathname);
  };

  return (
    <>
      {view === "list" && !hasAccounts && (
        <EmptyMailbox onAddAccount={handleAddAccount} />
      )}
      {view === "list" && hasAccounts && (
        <ConnectedAccounts onAddAccount={handleAddAccount} />
      )}
      {view === "add" && <AddAccountWizard onCancel={handleCancel} />}
    </>
  );
}
