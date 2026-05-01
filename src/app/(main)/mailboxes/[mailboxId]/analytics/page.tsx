import AnalyticsClient from "@/_components/analytics/AnalyticsClient";

interface AnalyticsPageProps {
  params: Promise<{
    mailboxId: string;
  }>;
}

export default async function AnalyticsPage({ params }: AnalyticsPageProps) {
  const { mailboxId } = await params;
  return <AnalyticsClient mailboxId={mailboxId} />;
}
