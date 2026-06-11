"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMailStore } from "@/stores/useMailStore";
import { MailInbox } from "@/_components/mailbox/MailInbox";
import type { EmailFolder } from "@/APIs/types/Email";

// Folders that show the MailInbox component
const mailFolders: EmailFolder[] = [
  "inbox",
  "sent",
  "starred",
  "trash",
  "spam",
  "phishing",
  "malware",
];

// All valid sections (mail folders + security/analytics sections)
const validSections: string[] = [...mailFolders];

interface FolderClientProps {
  mailboxId: string;
  folder: string;
}

export function FolderClient({ mailboxId, folder }: FolderClientProps) {
  const router = useRouter();
  const setActiveFolder = useMailStore((s) => s.setActiveFolder);

  useEffect(() => {
    if (!validSections.includes(folder)) {
      router.replace("/mailboxes");
      return;
    }
    // Set active folder for mail folders
    if (mailFolders.includes(folder as EmailFolder)) {
      setActiveFolder(folder as EmailFolder);
    }
  }, [folder, setActiveFolder, router]);

  if (!validSections.includes(folder)) {
    return null;
  }

  if (mailFolders.includes(folder as EmailFolder)) {
    return <MailInbox />;
  }

  return null;
}
