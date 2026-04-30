import { FolderClient } from "./FolderClient";

interface FolderPageProps {
  params: Promise<{
    mailboxId: string;
    folder: string;
  }>;
}

export default async function FolderPage({ params }: FolderPageProps) {
  const { mailboxId, folder } = await params;

  return <FolderClient mailboxId={mailboxId} folder={folder} />;
}
