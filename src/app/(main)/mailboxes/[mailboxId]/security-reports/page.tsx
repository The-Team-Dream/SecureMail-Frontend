import SecurityReportsClient from "./SecurityReportsClient";

interface SecurityReportsPageProps {
  params: Promise<{
    mailboxId: string;
  }>;
}

export default async function SecurityReportsPage({ params }: SecurityReportsPageProps) {
  const { mailboxId } = await params;
  return <SecurityReportsClient mailboxId={mailboxId} />;
}
