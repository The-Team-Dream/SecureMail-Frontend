"use client";

import React from "react";
import { Star, FileText, Trash2, MailOpen, Archive } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Email } from "@/types/mail";
import { useMailStore } from "@/stores/useMailStore";
import { Text } from "../shared/Text";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

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
  const toggleStarEmail = useMailStore((s) => s.toggleStarEmail);
  const deleteEmail = useMailStore((s) => s.deleteEmail);
  const archiveEmail = useMailStore((s) => s.archiveEmail);
  const toggleReadEmail = useMailStore((s) => s.toggleReadEmail);
  const selectedIds = useMailStore((s) => s.selectedIds);
  const isSelected = selectedIds.includes(email.id);

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group flex items-start sm:items-center gap-2 sm:gap-3 px-2 sm:px-4 py-3 sm:py-4 border-b-2 border-primary-50",
        "cursor-pointer transition-colors duration-150",
        isSelected && "bg-primary-50",
      )}
    >
      <div className="flex items-center pt-0.5 sm:pt-0 gap-1 sm:gap-2 shrink-0">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => toggleSelectEmail(email.id)}
          className="w-4 h-4 rounded border-[1.5px] border-primary-400 text-secondary-600 focus:ring-secondary-600 cursor-pointer accent-secondary-600 shrink-0"
          onClick={(e) => e.stopPropagation()}
        />

        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleStarEmail(email.id);
          }}
          className="p-0.5 rounded-full transition-colors shrink-0 cursor-pointer sm:mr-2"
          aria-label={email.isStarred ? "Unstar email" : "Star email"}
        >
          <Star
            className={cn(
              "w-4 h-4 sm:w-5 sm:h-5 transition-colors",
              email.isStarred
                ? "fill-warning-400 text-warning-400"
                : "text-primary-400",
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
            className={"truncate sm:w-28 shrink-0 sm:text-sm"}
          >
            {email.sender}
          </Text>

          {/* Date on Mobile */}
          <span
            className={cn(
              "text-[10px] sm:hidden shrink-0 text-primary-800",
              !email.isRead ? "font-bold" : "font-normal",
            )}
          >
            {email.date}
          </span>
        </div>

        {/* Title + Attachment */}
        <div className="flex-1 min-w-0 max-w-[650px] flex flex-col items-start gap-1 sm:gap-2">
          <span
            className={cn(
              "truncate w-full text-xs sm:text-sm text-primary-800",
              !email.isRead ? "font-semibold" : "font-normal",
            )}
          >
            {email.subject}
          </span>

          {/* === (Attachment) === */}
          {email.hasAttachment && email.attachmentName && (
            <span className="inline-flex items-center gap-1 sm:gap-2 px-2 py-0.5 border border-primary-200 rounded-3xl text-[10px] sm:text-sm text-primary-500 shrink-0 mt-1 sm:mt-0">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4 text-error-500" />
              {email.attachmentName}
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
          {email.date}
        </span>

        {/* Actions on Desktop */}
        <div className="hidden sm:group-hover:flex items-center gap-1 shrink-0 ml-auto pl-2">
          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              archiveEmail(email.id);
              toast.success("email has been archived", {
                position: "bottom-left",
              });
            }}
            aria-label="Archive email"
            title="Archive"
          >
            <Archive className="w-4 h-4 text-primary-800" />
          </Button>

          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              deleteEmail(email.id);
              toast.success("email has been deleted", {
                position: "bottom-left",
              });
            }}
            aria-label="Delete email"
            title="Delete"
          >
            <Trash2 className="w-4 h-4 text-primary-800 hover:text-error-500 transition-colors" />
          </Button>

          <Button
            size={"icon-sm"}
            variant={"ghost"}
            onClick={(e) => {
              e.stopPropagation();
              toggleReadEmail(email.id);
              toast.success(
                email.isRead
                  ? "email has been marked as unread"
                  : "email has been marked as read",
                { position: "bottom-left" },
              );
            }}
            aria-label={email.isRead ? "Mark as unread" : "Mark as read"}
            title={email.isRead ? "Mark as unread" : "Mark as read"}
          >
            <MailOpen className="w-4 h-4 text-primary-800" />
          </Button>
        </div>
      </div>
    </div>
  );
};
