"use client";
import { useState, useCallback } from "react";
import { MailRow } from "./MailRow";
import { useMailStore } from "@/stores/useMailStore";
import { useParams } from "next/navigation";
import { useEmails, useSearchEmails } from "@/APIs/hooks/emails";
import type { Email, EmailFolder, Attachment } from "@/APIs/types/Email";
import { MailListSkeleton } from "../skeleton/MailListSkeleton";
import { StateMessage } from "@/_components/shared/StateMessage";
import notFoundImg from "../../../public/images/not-found.png";
import { FilePreviewModal } from "./FilePreviewModal";

export const MailList = () => {
  const params = useParams();
  const mailboxId = params.mailboxId as string;
  const activeFolder = useMailStore((s) => s.activeFolder) as EmailFolder;
  const currentPage = useMailStore((s) => s.currentPage);
  const searchQuery = useMailStore((s) => s.searchQuery);

  const { data: emailsData, isLoading: isLoadingEmails } = useEmails(
    mailboxId,
    activeFolder,
    currentPage,
  );
  const { data: searchData, isLoading: isLoadingSearch } = useSearchEmails(
    mailboxId,
    searchQuery,
    currentPage,
  );

  const isSearching = searchQuery.trim().length > 0;
  const currentData = isSearching ? searchData : emailsData;
  const isLoading = isSearching ? isLoadingSearch : isLoadingEmails;
  const pagedEmails = Array.isArray(currentData)
    ? currentData
    : currentData?.data || [];

  const finalEmails = pagedEmails;

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [previewAttachment, setPreviewAttachment] = useState<Attachment | null>(null);
  const [previewEmailId, setPreviewEmailId] = useState<string>("");

  const handleDragStart = useCallback((index: number) => {
    setDragIndex(index);
  }, []);

  const handleDragOver = useCallback(
    (overIndex: number) => {
      if (dragIndex === null || dragIndex === overIndex) return;
      setDragIndex(overIndex);
    },
    [dragIndex],
  );

  const handleDragEnd = useCallback(() => {
    setDragIndex(null);
  }, []);

  if (isLoading) {
    return <MailListSkeleton />;
  }

  if (finalEmails.length === 0) {
    const emptyTitle = isSearching ? "No Results Found" : "No Emails Found";
    const emptyDescription = isSearching
      ? `No results found for "${searchQuery}". Please try adjusting your keywords.`
      : activeFolder === "trash"
        ? "Your trash is currently empty."
        : activeFolder === "starred"
          ? "You haven't starred any emails yet."
          : `No emails found in your ${activeFolder}.`;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <StateMessage
          image={notFoundImg}
          title={emptyTitle}
          description={emptyDescription}
          className="h-full"
        />
      </div>
    );
  }

  return (
    <div
      className="flex-1 overflow-y-auto overflow-x-hidden pb-4"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      {finalEmails.map((email: Email, index: number) => (
        <MailRow
          key={email.id}
          email={email}
          index={index}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          onPreviewAttachment={(att, emailId) => {
            setPreviewAttachment(att);
            setPreviewEmailId(emailId);
          }}
        />
      ))}

      <FilePreviewModal
        isOpen={previewAttachment !== null}
        onClose={() => setPreviewAttachment(null)}
        attachment={previewAttachment}
        mailboxId={mailboxId}
        emailId={previewEmailId}
      />
    </div>
  );
};
