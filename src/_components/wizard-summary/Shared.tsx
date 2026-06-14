import React from "react";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff, X, Pencil, ChevronDown } from "lucide-react";

/** Displays a labeled value in view mode */
export function ViewField({
  label,
  value,
  fallback,
}: {
  label: string;
  value?: string;
  fallback?: string;
}) {
  return (
    <div>
      <div className="text-[13px] text-primary-400 mb-1.5 font-medium text-nowrap">
        {label}
      </div>
      <div className="text-[15px] font-bold tracking-tight text-primary-900">
        {value || fallback || "—"}
      </div>
    </div>
  );
}

/** Password display with show/hide eye toggle */
export function PasswordField({
  label,
  value,
  show,
  onToggle,
}: {
  label: string;
  value?: string;
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div>
      <div className="text-[13px] text-primary-400 mb-1.5 font-medium">
        {label}
      </div>
      <div className="flex items-center gap-3">
        <div
          className={
            show
              ? "text-[15px] font-bold tracking-tight text-primary-900 pt-1"
              : "text-[24px] leading-none tracking-widest text-primary-900 pt-2"
          }
        >
          {show ? value || "Not Set" : "••••••"}
        </div>
        {show ? (
          <EyeOff
            className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1"
            onClick={onToggle}
          />
        ) : (
          <Eye
            className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1"
            onClick={onToggle}
          />
        )}
      </div>
    </div>
  );
}

/** Edit / Cancel Editing toggle button */
export function EditButton({
  isEditing,
  onEdit,
  onCancel,
}: {
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
}) {
  return isEditing ? (
    <Button
      type="button"
      variant="default"
      onClick={onCancel}
      className="shrink-0 bg-error-600 hover:bg-error-700 text-white h-10 gap-2 px-3 rounded-[6px] text-sm font-semibold shadow-none"
    >
      <X className="w-4 h-4 stroke-3" />{" "}
      <span className="hidden md:flex">Cancel Editing</span>
    </Button>
  ) : (
    <Button
      type="button"
      variant="outline"
      onClick={onEdit}
      className="shrink-0 h-10 gap-2 px-3 rounded-[6px] text-primary-700 border-primary-200 hover:bg-primary-50 text-sm font-semibold shadow-none"
    >
      <Pencil className="w-3.5 h-3.5" /> <span className="hidden md:flex">Edit</span>
    </Button>
  );
}

/** Section wrapper: icon + title + edit button + children */
export function SectionBlock({
  icon,
  title,
  isEditing,
  onEdit,
  onCancel,
  children,
  bordered = true,
}: {
  icon: React.ReactNode;
  title: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  bordered?: boolean;
}) {
  return (
    <div
      className={`flex flex-col py-8 ${bordered ? "border-b border-primary-100" : "pb-16"}`}
    >
      <div className="flex justify-between items-center w-full mb-2">
        <div className="flex items-center gap-2.5 text-secondary-800 font-semibold">
          {icon} {title}
        </div>
        <EditButton isEditing={isEditing} onEdit={onEdit} onCancel={onCancel} />
      </div>
      {children}
    </div>
  );
}

/** Security dropdown (shared by IMAP & SMTP) */
export function SecuritySelect({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col">
      <label className="block text-[13px] text-primary-400 mb-1.5 font-normal">
        Encryption
      </label>
      <div className="relative">
        <select
          className="w-full h-12 px-4 border border-primary-100 rounded-lg outline-none appearance-none focus:border-primary-400 text-primary-900 bg-transparent"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="SSL/TLS">SSL/TLS</option>
          <option value="STARTTLS">STARTTLS</option>
          <option value="None">None</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
      </div>
    </div>
  );
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type MailConfigDraft = {
  host: string;
  port: string;
  security: string;
  username: string;
  password: string;
};

export type MailboxDraft = {
  mailboxName: string;
  emailAddress: string;
};

export type AdvancedDraft = {
  syncInterval: string;
};
