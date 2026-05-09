"use client";

import React from "react";
import { Star, FileText, MailOpen, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Email, EmailFolder } from "@/APIs/types/Email";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "../shared/Text";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useEmailActions } from "@/APIs/hooks/useEmails";

import { RISK_STYLE_MAP } from "@/constants/security";
import { Icons } from "@/constants/icons";

interface MailRowProps {
  email: Email;
  index: number;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

export const MailRow = ({
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
  const { deleteMutation, readMutation, starMutation } = useEmailActions(
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
          <Star
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
              email.isFlagged || email.folder === "starred"
                ? "fill-warning-400 text-warning-400"
                : "text-primary-400 hover:text-warning-400",
            )}
          />
        </button>
      </div>

      <div className="flex-1 flex flex-col sm:flex-row sm:items-center min-w-0 gap-1 sm:gap-4 w-full">
        <div className="flex justify-between items-center w-full sm:w-auto">
          <Text
            font={!email.isRead ? "semiBold" : "normal"}
            color={"primary-800"}
            size={"xs"}
            className={"truncate sm:w-28 md:w-80 shrink-0 sm:text-sm"}
          >
            {activeFolder === "sent"
              ? `To: ${email.toAddr && email.toAddr.length > 0 ? email.toAddr.map((addr) => addr.split("@")[0]).join(", ") : "Unknown Recipient"}`
              : `${email.fromName || (email.fromAddr ? email.fromAddr.split("@")[0] : "Unknown Sender")}`}
            {!email.isRead && (
              <span className="ml-2 px-1.5 py-0.5 text-[10px] font-bold bg-primary-800 text-background rounded uppercase tracking-wider animate-pulse">
                New
              </span>
            )}
          </Text>

          {/* Date on Mobile */}
          <span
            className={cn(
              "text-[10px] sm:hidden shrink-0 text-primary-800",
              !email.isRead ? "font-bold" : "font-normal",
            )}
          >
            {new Date(email.receivedAt).toLocaleDateString()}
          </span>
        </div>

        {/* Title + Attachment */}
        <div className="flex-1 min-w-0 max-w-[650px] flex flex-col items-start gap-1 sm:gap-2">
          <div className="flex items-center gap-2 w-full truncate">
            <span
              className={cn(
                "truncate text-xs sm:text-sm text-primary-800",
                !email.isRead ? "font-semibold" : "font-normal",
              )}
            >
              {email.subject}
            </span>
          </div>

          {/* Risk Level Indicator */}
          {email.isPhishing &&
            riskLevel &&
            RISK_STYLE_MAP[riskLevel as keyof typeof RISK_STYLE_MAP] && (
              <div
                className={cn(
                  "flex items-center gap-1.5",
                  RISK_STYLE_MAP[riskLevel as keyof typeof RISK_STYLE_MAP],
                )}
              >
                <div className="w-1 h-1 rounded-full bg-current" />
                <span className="text-xs font-medium leading-none">
                  {riskLevel}
                </span>
              </div>
            )}

          {/* === (Attachment) === */}
          {email.hasAttachments && (
            <span className="inline-flex items-center gap-1 sm:gap-2 px-2 py-0.5 border border-primary-200 rounded-3xl text-[10px] sm:text-sm text-primary-500 shrink-0 mt-1 sm:mt-0">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-error-500" />
              Attachment
            </span>
          )}
        </div>

        {/* Date on Desktop */}
        <span
          className={cn(
            "text-xs shrink-0 ml-auto pl-2 hidden sm:block",
            "group-hover:hidden text-primary-800",
            !email.isRead ? "font-bold" : "font-normal",
          )}
        >
          {new Date(email.receivedAt).toLocaleDateString()}
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
              if (activeFolder !== "trash") {
                deleteMutation.mutate(String(email.id));
              }
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
};
