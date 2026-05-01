"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMailStore } from "@/stores/useMailStore";
import { MailInbox } from "@/_components/mailbox/MailInbox";
import { MalwareInbox } from "@/_components/mailbox/MalwareInbox";
import type { Folder } from "@/types/mail";


// Folders that show the MailInbox component
const mailFolders: Folder[] = [
  "inbox",
  "sent",
  "starred",
  "trash",
  "spam",
  "phishing",
  "malware",
];

// All valid sections (mail folders + security/analytics sections)
const validSections: string[] = [
  ...mailFolders,
];

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
    if (mailFolders.includes(folder as Folder)) {
      setActiveFolder(folder as Folder);
    }
  }, [folder, setActiveFolder, router]);

  if (!validSections.includes(folder)) {
    return null;
  }

  // Render based on section
  if (folder === "malware") {
    return <MalwareInbox />;
  }

  if (mailFolders.includes(folder as Folder)) {
    return <MailInbox />;
  }

  return null;
}
