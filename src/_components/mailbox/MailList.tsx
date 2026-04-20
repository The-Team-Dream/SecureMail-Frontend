"use client";

import { useState, useCallback } from "react";
import { Inbox } from "lucide-react";
import { MailRow } from "./MailRow";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "../shared/Text";

export const MailList = () => {
  const emails = useMailStore((s) => s.emails);
  const activeFolder = useMailStore((s) => s.activeFolder);
  const activeClassification = useMailStore((s) => s.activeClassification);
  const currentPage = useMailStore((s) => s.currentPage);
  const searchQuery = useMailStore((s) => s.searchQuery);

  const getPagedEmails = useMailStore((s) => s.getPagedEmails);
  const reorderEmails = useMailStore((s) => s.reorderEmails);
  const pagedEmails = getPagedEmails();
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (overIndex: number) => {
      if (dragIndex === null || dragIndex === overIndex) return;
      reorderEmails(dragIndex, overIndex);
      setDragIndex(overIndex);
    },
    [dragIndex, reorderEmails],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
  }, []);

  if (pagedEmails.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Inbox className="w-16 h-16 mb-4 text-primary" />
        <Text size={"lg"} font={"medium"}>
          No emails found
        </Text>
        <Text size={"sm"} className="mt-2 text-center">
          {activeFolder === "trash"
            ? "Your trash is empty"
            : activeFolder === "starred"
              ? "No starred emails yet"
              : "No emails in this folder"}
        </Text>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {pagedEmails.map((email, index) => (
        <MailRow
          key={email.id}
          email={email}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        />
      ))}
    </div>
  );
};
