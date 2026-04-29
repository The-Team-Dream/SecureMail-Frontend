import React from "react";
import { MailDetails } from "@/_components/mailbox/MailDetails";

export default async function EmailDetailsPage({
  params,
}: {
  params: Promise<{ folder: string; mailboxId: string; emailId: string }>;
}) {
  const { emailId } = await params;
  return <MailDetails emailId={emailId} />;
}
