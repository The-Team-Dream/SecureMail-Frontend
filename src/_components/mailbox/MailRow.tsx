"use client";

import React, { useMemo } from "react";
import { FileText, MailOpen, Mail, Paperclip } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Email, EmailFolder } from "@/APIs/types/Email";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useParams } from "next/navigation";
import {
  useReadEmail,
  useStarEmail,
  useDeleteEmailWithUndo,
} from "@/APIs/hooks/emails";

import { RISK_STYLE_MAP } from "@/constants/security";
import { Icons } from "@/constants/icons";

interface MailRowProps {
  email: Email;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

export const MailRow = React.memo(({
  email,
  index,
  onDragStart,
  onDragOver,
  onDragEnd,
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
  const deleteWithUndo = useDeleteEmailWithUndo(
    mailboxId,
    activeFolder as EmailFolder,
  );

  const riskLevel = email.malwareVerdict
    ? "High"
    : email.isPhishing
      ? "High"
      : email.isSpam
        ? "Medium"
        : "Low";

  // Memoize formatted date to avoid creating Date objects on every render
  const formattedDate = useMemo(
    () => new Date(email.receivedAt).toLocaleDateString(),
    [email.receivedAt],
  );

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      onClick={() => router.push(`${pathname}/${String(email.id)}`)}
      className={cn(
        "group flex items-center gap-4 p-4 border-b border-primary-50 hover:bg-primary-50 transition-colors cursor-pointer relative z-0 hover:z-10",
        !email.isRead ? "bg-background" : "bg-transparent",
      )}
    >
      <div className="flex items-center pt-0.5 sm:pt-0 gap-1 sm:gap-2 shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectEmail(String(email.id))}
          className="w-4 h-4 rounded border-[1.5px] border-primary-400 text-secondary-600 focus:ring-secondary-600 cursor-pointer accent-secondary-600 shrink-0"
          onClick={(e) => e.stopPropagation()}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            starMutation.mutate({
              id: String(email.id),
              starred: !email.isFlagged,
            });
          }}
          className="p-0.5 rounded-full transition-colors shrink-0 cursor-pointer sm:mr-2"
          aria-label={email.isFlagged ? "Unstar email" : "Star email"}
        >
          <Icons.Star
            active={email.isFlagged || email.folder === "starred"}
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
              email.isFlagged || email.folder === "starred"
                ? "text-warning-500"
                : "text-primary-400 hover:text-warning-400",
            )}
          />
        </button>
      </div>

      <div className="flex-1 flex items-center gap-4 min-w-0">
        <div className="flex min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Text
              font={!email.isRead ? "bold" : "medium"}
              className={"truncate sm:w-28 md:w-52 shrink-0 sm:text-sm"}
            >
              {activeFolder === "sent"
                ? `To: ${email.toAddr && email.toAddr.length > 0 ? email.toAddr.map((addr) => addr.split("@")[0]).join(", ") : "Unknown Recipient"}`
                : `${email.fromName || (email.fromAddr ? email.fromAddr.split("@")[0] : "Unknown Sender")}`}
              {!email.isRead && (
                <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-primary text-background rounded uppercase">
                  New
                </span>
              )}
            </Text>
            {email.hasAttachments && (
              <FileText className="w-3.5 h-3.5 text-primary-400 shrink-0" />
            )}
          </div>
          <div className="flex flex-col gap-1">
            <Text
              size="sm"
              font={!email.isRead ? "semiBold" : "normal"}
              color={!email.isRead ? "primary-900" : "primary-500"}
              className="truncate"
            >
              {email.subject}
            </Text>

            {/* Phishing Specific Style */}
            {activeFolder === "phishing" && (
              <div className="flex items-center gap-1.5">
                <span
                  className={cn(
                    "w-1 h-1 rounded-full bg-current",
                    RISK_STYLE_MAP[riskLevel as keyof typeof RISK_STYLE_MAP] ||
                      "text-error-500",
                  )}
                />
                <Text
                  size="xs"
                  className={cn(
                    "font-medium",
                    RISK_STYLE_MAP[riskLevel as keyof typeof RISK_STYLE_MAP] ||
                      "text-error-500",
                  )}
                >
                  {riskLevel}
                </Text>
              </div>
            )}

            {/* Attachment Chips */}
            {email.attachments && email.attachments.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {email.attachments.slice(0, 3).map((att) => {
                  const isImage = att.contentType?.startsWith("image/");
                  const isExternal =
                    att.url &&
                    (att.url.startsWith("http://") ||
                      att.url.startsWith("https://"));
                  return (
                    <span
                      key={att.id}
                      className="inline-flex items-center gap-1.5 bg-primary-100 border border-primary-200 rounded-full px-2 py-0.5 text-[11px] text-primary-700 max-w-[140px]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isImage && isExternal ? (
                        <img
                          src={att.url}
                          alt=""
                          className="w-4 h-4 rounded object-cover shrink-0"
                          onError={(e) =>
                            ((e.target as HTMLImageElement).style.display =
                              "none")
                          }
                        />
                      ) : (
                        <Paperclip className="w-3 h-3 shrink-0 text-primary-500" />
                      )}
                      <span className="truncate">{att.filename}</span>
                    </span>
                  );
                })}
                {email.attachments.length > 3 && (
                  <span className="inline-flex items-center bg-primary-100 border border-primary-200 rounded-full px-2 py-0.5 text-[11px] text-primary-500">
                    +{email.attachments.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
        <span
          className={cn(
            "text-xs shrink-0 ml-auto pl-2 hidden sm:block",
            "group-hover:hidden text-primary-800",
            !email.isRead ? "font-bold" : "font-normal",
          )}
        >
          {formattedDate}
        </span>

        {/* Actions on Desktop */}
        <div className="hidden sm:group-hover:flex items-center gap-1 shrink-0 ml-auto pl-2">
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            className={cn(
              activeFolder === "trash" && "cursor-not-allowed opacity-50",
            )}
            onClick={(e) => {
              e.stopPropagation();
              deleteWithUndo(String(email.id));
            }}
            disabled={activeFolder === "trash"}
            aria-label="Delete email"
            title={
              activeFolder === "trash" ? "Cannot delete from trash" : "Delete"
            }
          >
            <Icons.Delete className="w-6 h-6 text-primary-800 hover:text-error-500 transition-colors" />
          </Button>

          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              readMutation.mutate({
                id: String(email.id),
                read: !email.isRead,
              });
            }}
            aria-label={email.isRead ? "Mark as unread" : "Mark as read"}
            title={email.isRead ? "Mark as unread" : "Mark as read"}
          >
            {email.isRead ? (
              <Mail className="w-4 h-4 text-primary-800" />
            ) : (
              <MailOpen className="w-4 h-4 text-primary-800" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
});

MailRow.displayName = "MailRow";
