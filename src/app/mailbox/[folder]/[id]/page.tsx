"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useMailStore } from "@/stores/useMailStore";
import { MailInbox } from "@/_components/mailbox/MailInbox";
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

export default function FolderPage() {
  const params = useParams();
  const router = useRouter();
  const setActiveFolder = useMailStore((s) => s.setActiveFolder);
  const folder = params.folder as string;
  const id = params.id as string;

  useEffect(() => {
    if (!validSections.includes(folder)) {
      router.replace("/dashboard/mailboxes");
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
  if (mailFolders.includes(folder as Folder)) {
    return <MailInbox />;
  }

  return null;
}
