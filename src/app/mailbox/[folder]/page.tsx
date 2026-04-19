"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMailStore } from "@/stores/useMailStore";
import { MailInbox } from "@/_components/mailbox/MailInbox";
import type { Folder } from "@/types/mail";
const validFolders: Folder[] = [
  "inbox",
  "sent",
  "starred",
  "trash",
  "spam",
  "phishing",
  "malware",
];

export default function FolderPage() {
  const params = useParams();
  const router = useRouter();
  const setActiveFolder = useMailStore((s) => s.setActiveFolder);
  const folder = params.folder as string;
  useEffect(() => {
    if (validFolders.includes(folder as Folder)) {
      setActiveFolder(folder as Folder);
    } else {
      router.replace("/mails/inbox");
    }
  }, [folder, setActiveFolder, router]);

  if (!validFolders.includes(folder as Folder)) {
    return null;
  }

  return <MailInbox />;
}
