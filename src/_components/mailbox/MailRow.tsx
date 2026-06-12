"use client";

import React, { useMemo } from "react";
import {
  MailOpen,
  Mail,
  Paperclip,
  ImageIcon,
  Film,
  File,
  FileAudio,
  FileSpreadsheet,
  FileArchive,
  Square,
  CheckSquare,
} from "lucide-react";
import { FaFileWord, FaRegFilePdf } from "react-icons/fa";

import { cn } from "@/lib/utils";
import type { Email, EmailFolder, Attachment } from "@/APIs/types/Email";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "@/_components/shared/Text";
import { useRouter, usePathname, useParams } from "next/navigation";
import {
  useReadEmail,
  useStarEmail,
  useDeleteEmail,
} from "@/APIs/hooks/emails";
import { ActionButton } from "@/_components/shared/ActionButton";

import { Icons } from "@/constants/icons";

interface MailRowProps {
  email: Email;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
  onPreviewAttachment?: (attachment: Attachment, emailId: string) => void;
}

export const MailRow = React.memo(
  ({
    email,
    index,
    onDragStart,
    onDragOver,
    onDragEnd,
    onPreviewAttachment,
  }: MailRowProps) => {
    const toggleSelectEmail = useMailStore((s) => s.toggleSelectEmail);
    const selectedIds = useMailStore((s) => s.selectedIds);
    const isSelected = selectedIds.includes(String(email.id));
    const router = useRouter();
    const pathname = usePathname();
    const params = useParams();
    const mailboxId = params.mailboxId as string;
    const activeFolder = useMailStore((s) => s.activeFolder);

    const readMutation = useReadEmail(mailboxId);
    const starMutation = useStarEmail(mailboxId);
    const deleteMutation = useDeleteEmail(
      mailboxId,
      activeFolder as EmailFolder,
    );
    const badges = [
      {
        folder: "spam",
        score: email.spamScore,
        label: "Spam Score",
        className: "bg-warning-50 text-warning-700 border-warning-200",
      },
      {
        folder: "phishing",
        score: email.phishingScore,
        label: "Phishing Score",
        className: "bg-error-500 text-error-100 border-error-500",
      },
      {
        folder: "malware",
        score: email.malwareScore,
        label: "Malware Score",
        className: "bg-error-50 text-error-700 border-error-200",
      },
    ];
    const getSecurityLevel = (email: Email) => {
      if (email.malwareVerdict === "MALICIOUS") return "MALICIOUS";
      if (email.malwareVerdict === "SUSPICIOUS") return "SUSPICIOUS";

      if (email.phishingScore > 80) return "PHISHING";
      if (email.phishingScore > 50) return "SUSPICIOUS";

      if (email.malwareVerdict === "UNKNOWN") return "UNKNOWN";

      return "CLEAN";
    };

    const securityLevel = getSecurityLevel(email);

    const displayDate = useMemo(() => {
      const emailDate = new Date(email.receivedAt);
      const today = new Date();
      const isToday =
        emailDate.getDate() === today.getDate() &&
        emailDate.getMonth() === today.getMonth() &&
        emailDate.getFullYear() === today.getFullYear();

      if (isToday) {
        return emailDate.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
        });
      } else {
        return emailDate.toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        });
      }
    }, [email.receivedAt]);

    const showNewBadge = !email.isRead;
    const isStarred = email.isFlagged || email.folder === "starred";

    const senderName =
      activeFolder === "sent"
        ? `To: ${
            email.toAddr
              ? Array.isArray(email.toAddr)
                ? email.toAddr.map((addr) => addr.split("@")[0]).join(", ")
                : (email.toAddr as any).split("@")[0]
              : "Unknown Recipient"
          }`
        : email.fromName ||
          (email.fromAddr ? email.fromAddr.split("@")[0] : "Unknown Sender");

    return (
      <div
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData("text/plain", String(email.id));
          onDragStart(index);
        }}
        onDragOver={(e) => {
          e.preventDefault();
          onDragOver(index);
        }}
        onDragEnd={onDragEnd}
        onClick={() => {
          if (String(email.id).startsWith("temp-")) return;
          router.push(`${pathname}/${String(email.id)}`);
        }}
        className={cn(
          "group flex items-center gap-0 border-b border-primary-50 transition-all duration-150 relative z-0 hover:z-10",
          String(email.id).startsWith("temp-")
            ? "opacity-65 pointer-events-none cursor-not-allowed select-none animate-pulse"
            : "hover:bg-primary-50/70 cursor-pointer",
          !email.isRead ? "bg-background" : "bg-transparent",
          isSelected && "bg-primary-50/70",
        )}
      >
        {/* Checkbox + Star  */}
        <div className="flex flex-row items-center justify-center px-2 sm:px-3 py-3 shrink-0">
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            <ActionButton
              label={isSelected ? "Deselect" : "Select"}
              tooltipSide="top"
              onClick={() => toggleSelectEmail(String(email.id))}
              icon={
                isSelected ? (
                  <CheckSquare className="w-4.5 h-4.5 text-primary" />
                ) : (
                  <Square className="w-4.5 h-4.5 text-primary-300 group-hover:text-primary-400" />
                )
              }
              className="h-7 w-7 rounded-sm"
            />
          </div>

          {/* Star */}
          <div className="hidden sm:block" onClick={(e) => e.stopPropagation()}>
            <ActionButton
              label={isStarred ? "Unstar" : "Star"}
              tooltipSide="top"
              onClick={() => {
                starMutation.mutate({
                  id: String(email.id),
                  starred: !email.isFlagged,
                });
              }}
              icon={
                <Icons.Star
                  active={isStarred}
                  disableGroupHover
                  className={cn(
                    "w-4 h-4 transition-colors",
                    isStarred
                      ? "text-warning-500"
                      : "text-primary-300 hover:text-warning-400",
                  )}
                />
              }
              className="p-0.5 w-7 h-7 rounded-full hover:bg-primary-50 text-primary-300"
            />
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 min-w-0 py-3 pr-3 sm:pr-4">
          {/* Sender name row */}
          <div className="flex items-center justify-between sm:justify-start gap-2 min-w-0 sm:w-[180px] sm:shrink-0">
            <div className="flex items-center gap-2 min-w-0">
              <Text
                font={!email.isRead ? "bold" : "medium"}
                className="truncate text-sm"
              >
                {senderName}
              </Text>
              {/* Desktop New Badge */}
              {activeFolder !== "sent" && showNewBadge && (
                <span className="hidden sm:inline-flex shrink-0 px-1.5 py-0.5 text-[9px] font-black bg-primary text-background rounded uppercase tracking-wider">
                  New
                </span>
              )}
              {email.hasAttachments && (
                <Paperclip className="w-3 h-3 text-primary-400 shrink-0" />
              )}
            </div>
            {/* Mobile: blue dot + date */}
            <div className="sm:hidden flex items-center gap-1.5 shrink-0">
              {showNewBadge && (
                <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
              )}
              <span
                className={cn(
                  "text-[11px] whitespace-nowrap",
                  !email.isRead
                    ? "font-semibold text-primary-600"
                    : "font-normal text-primary-400",
                )}
              >
                {displayDate}
              </span>
            </div>
          </div>

          {/* Subject + attachments + date (mobile) */}
          <div className="flex-1 min-w-0 flex flex-col gap-0.5">
            <div className="flex items-start gap-2">
              <Text
                size="sm"
                font={!email.isRead ? "semiBold" : "normal"}
                color={!email.isRead ? "primary-900" : "primary-500"}
                className="line-clamp-2 leading-snug"
              >
                {email.subject}
              </Text>

              {/* Email Risk Score on Desktop */}
              {badges
                .filter(
                  (b) =>
                    b.folder === activeFolder && typeof b.score === "number",
                )
                .map((b, index) => (
                  <span
                    key={index}
                    className={cn(
                      "hidden lg:block shrink-0 w-fit mt-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border",
                      b.className,
                    )}
                  >
                    {b.label}: {b.score}%
                  </span>
                ))}
            </div>
            <div className="flex items-center gap-2">
              {activeFolder === "phishing" && (
                <div className="flex items-center gap-1">
                  <div
                    className={`w-2 h-2 ${
                      securityLevel === "MALICIOUS"
                        ? "bg-error-500"
                        : securityLevel === "SUSPICIOUS"
                          ? "bg-warning-500"
                          : securityLevel === "CLEAN"
                            ? "bg-green-600"
                            : "bg-primary-500"
                    } rounded-full`}
                  />
                  <span
                    className={cn(
                      "text-[10px] md:text-xs w-fit font-bold tracking-wider uppercase",
                      securityLevel === "MALICIOUS"
                        ? "text-error-500"
                        : securityLevel === "SUSPICIOUS"
                          ? "text-warning-500"
                          : securityLevel === "CLEAN"
                            ? "text-green-600"
                            : "text-primary-500",
                    )}
                  >
                    {securityLevel}
                  </span>
                </div>
              )}
              {/* Email Risk Score on Mobile */}
              {badges
                .filter(
                  (b) =>
                    b.folder === activeFolder && typeof b.score === "number",
                )
                .map((b, index) => (
                  <span
                    key={index}
                    className={cn(
                      "lg:hidden shrink-0 w-fit mt-0.5 text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider border",
                      b.className,
                    )}
                  >
                    {b.label}: {b.score}%
                  </span>
                ))}
            </div>
            {/* Attachment chips */}
            {(() => {
              const uniqueAtts = email.attachments
                ? Array.from(
                    new Map(
                      email.attachments.map((att) => [
                        att.filename || att.id,
                        att,
                      ]),
                    ).values(),
                  )
                : [];
              if (uniqueAtts.length === 0) return null;
              return (
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {uniqueAtts.slice(0, 2).map((att) => {
                    const getAttachmentIcon = () => {
                      const ct = (att.contentType || "").toLowerCase();
                      const fn = (att.filename || "").toLowerCase();
                      const ext = fn.split(".").pop();

                      if (
                        ct.startsWith("image/") ||
                        ["png", "jpg", "jpeg", "gif", "webp", "svg"].includes(
                          ext || "",
                        )
                      ) {
                        return (
                          <ImageIcon className="w-3.5 h-3.5 shrink-0 text-primary-500" />
                        );
                      }
                      if (
                        ct.startsWith("video/") ||
                        ["mp4", "mov", "avi", "webm"].includes(ext || "")
                      ) {
                        return (
                          <Film className="w-3.5 h-3.5 shrink-0 text-primary-500" />
                        );
                      }
                      if (
                        ct.startsWith("audio/") ||
                        ["mp3", "wav", "ogg", "m4a"].includes(ext || "")
                      ) {
                        return (
                          <FileAudio className="w-3.5 h-3.5 shrink-0 text-warning-500" />
                        );
                      }
                      if (ct === "application/pdf" || ext === "pdf") {
                        return (
                          <FaRegFilePdf className="w-3.5 h-3.5 shrink-0 text-error-500" />
                        );
                      }
                      if (
                        ct === "application/msword" ||
                        ct ===
                          "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
                        ["doc", "docx"].includes(ext || "")
                      ) {
                        return (
                          <FaFileWord className="w-3.5 h-3.5 shrink-0 text-blue-600" />
                        );
                      }
                      if (
                        ct === "application/vnd.ms-excel" ||
                        ct ===
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
                        ["xls", "xlsx", "csv"].includes(ext || "")
                      ) {
                        return (
                          <FileSpreadsheet className="w-3.5 h-3.5 shrink-0 text-success-600" />
                        );
                      }
                      if (
                        ct === "application/zip" ||
                        ct === "application/x-rar-compressed" ||
                        ["zip", "rar", "7z", "tar", "gz"].includes(ext || "")
                      ) {
                        return (
                          <FileArchive className="w-3.5 h-3.5 shrink-0 text-warning-600" />
                        );
                      }
                      return (
                        <File className="w-3.5 h-3.5 shrink-0 text-primary-500" />
                      );
                    };

                    return (
                      <span
                        key={att.id}
                        className="inline-flex items-center gap-1 bg-transparent border border-primary-200 rounded-full px-2.5 py-1 text-[10px] text-primary-600 cursor-pointer hover:bg-primary-100 hover:border-primary-400 hover:text-primary-950 transition-colors duration-150"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPreviewAttachment?.(att, String(email.id));
                        }}
                      >
                        {getAttachmentIcon()}
                        <span className="text-xs max-w-20 md:max-w-42 w-full truncate">
                          {att.filename}
                        </span>
                      </span>
                    );
                  })}
                  {uniqueAtts.length > 2 && (
                    <span className="inline-flex items-center bg-transparent border border-primary-200 rounded-full px-2 py-0 text-[10px] text-primary-500">
                      +{uniqueAtts.length - 2}
                    </span>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Right side: date (desktop) + actions */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            {/* Date — desktop only, hidden on hover */}
            <div className="hidden sm:flex sm:group-hover:hidden items-end">
              <span
                className={cn(
                  "text-xs text-primary-500 whitespace-nowrap",
                  !email.isRead ? "font-bold text-primary-800" : "font-normal",
                )}
              >
                {displayDate}
              </span>
            </div>

            {/* Desktop hover actions */}
            <div
              className="hidden sm:group-hover:flex items-center gap-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <ActionButton
                label={
                  activeFolder === "trash"
                    ? "Cannot delete from trash"
                    : "Delete"
                }
                tooltipSide="top"
                disabled={activeFolder === "trash"}
                onClick={() => deleteMutation.mutate(String(email.id))}
                icon={
                  <Icons.Delete
                    disableGroupHover
                    className="w-4 h-4 text-primary-600 hover:text-error-500 transition-colors"
                  />
                }
                className="h-7 w-7 rounded-full"
              />

              <ActionButton
                label={email.isRead ? "Mark as unread" : "Mark as read"}
                tooltipSide="top"
                onClick={() => {
                  readMutation.mutate({
                    id: String(email.id),
                    read: !email.isRead,
                  });
                }}
                icon={
                  email.isRead ? (
                    <Mail className="w-3.5 h-3.5 text-primary-600" />
                  ) : (
                    <MailOpen className="w-3.5 h-3.5 text-primary-600" />
                  )
                }
                className="h-7 w-7 rounded-full"
              />
            </div>

            {/* Mobile actions: star + read + delete */}
            <div
              className="flex sm:hidden items-center gap-1 ml-1"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Star */}
              <ActionButton
                label={isStarred ? "Unstar" : "Star"}
                tooltipSide="top"
                onClick={() =>
                  starMutation.mutate({
                    id: String(email.id),
                    starred: !email.isFlagged,
                  })
                }
                icon={
                  <Icons.Star
                    active={isStarred}
                    disableGroupHover
                    className={cn(
                      "w-3.5 h-3.5 transition-colors",
                      isStarred
                        ? "text-warning-500"
                        : "text-primary-400 hover:text-warning-500",
                    )}
                  />
                }
                className="h-7 w-7 rounded-full hover:bg-primary-50"
              />

              {/* Read toggle */}
              <ActionButton
                label={email.isRead ? "Mark as unread" : "Mark as read"}
                tooltipSide="top"
                onClick={() =>
                  readMutation.mutate({
                    id: String(email.id),
                    read: !email.isRead,
                  })
                }
                icon={
                  email.isRead ? (
                    <Mail className="w-3.5 h-3.5" />
                  ) : (
                    <MailOpen className="w-3.5 h-3.5" />
                  )
                }
                className={cn(
                  "h-7 w-7 rounded-full",
                  email.isRead
                    ? "text-primary-400 hover:text-primary hover:bg-primary-50"
                    : "text-primary hover:text-primary hover:bg-primary-50",
                )}
              />

              {/* Delete */}
              {activeFolder !== "trash" && (
                <ActionButton
                  label="Delete"
                  tooltipSide="top"
                  onClick={() => deleteMutation.mutate(String(email.id))}
                  icon={<Icons.Delete disableGroupHover className="w-3.5 h-3.5" />}
                  className="h-7 w-7 rounded-full text-primary hover:text-error-500 hover:bg-error-50"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    );
  },
);

MailRow.displayName = "MailRow";
