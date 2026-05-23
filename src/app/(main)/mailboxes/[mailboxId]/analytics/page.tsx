"use client";

import { use } from "react";
import AnalyticsClient from "@/_components/analytics/AnalyticsClient";

export default function MailboxAnalyticsPage({
  params,
}: {
  params: Promise<{ mailboxId: string }>;
}) {
  const { mailboxId } = use(params);
  return <AnalyticsClient mailboxId={mailboxId} />;
}
