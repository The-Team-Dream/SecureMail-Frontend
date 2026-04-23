"use client";

import React, { useState } from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import {
  Mail, Settings, Rocket, Eye, EyeOff,
  ChevronDown, ChevronRight, X, Pencil,
} from "lucide-react";
import { WizardStepProps } from "./WizardTypes";

// ─── Shared Sub-Components ──────────────────────────────────────────────────

/** Displays a labeled value in view mode */
function ViewField({ label, value, fallback }: { label: string; value?: string; fallback?: string }) {
  return (
    <div>
      <div className="text-[13px] text-primary-400 mb-1.5 font-medium">{label}</div>
      <div className="text-[15px] font-bold tracking-tight text-primary-900">{value || fallback || "—"}</div>
    </div>
  );
}

/** Password display with show/hide eye toggle */
function PasswordField({ label, value, show, onToggle }: {
  label: string; value?: string; show: boolean; onToggle: () => void;
}) {
  return (
    <div>
      <div className="text-[13px] text-primary-400 mb-1.5 font-medium">{label}</div>
      <div className="flex items-center gap-3">
        <div className={show
          ? "text-[15px] font-bold tracking-tight text-primary-900 pt-1"
          : "text-[24px] leading-none tracking-widest text-primary-900 pt-2"}>
          {show ? (value || "Not Set") : "••••••"}
        </div>
        {show
          ? <EyeOff className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" onClick={onToggle} />
          : <Eye    className="w-[18px] h-[18px] text-primary-400 cursor-pointer pt-1" onClick={onToggle} />}
      </div>
    </div>
  );
}

/** Edit / Cancel Editing toggle button */
function EditButton({ isEditing, onEdit, onCancel }: {
  isEditing: boolean; onEdit: () => void; onCancel: () => void;
}) {
  return isEditing ? (
    <Button variant="default" onClick={onCancel}
      className="w-[140px] flex-shrink-0 bg-error-600 hover:bg-error-700 text-white h-10 gap-2 px-3 rounded-[6px] text-sm font-semibold shadow-none">
      <X className="w-4 h-4 stroke-[3]" /> Cancel Editing
    </Button>
  ) : (
    <Button variant="outline" onClick={onEdit}
      className="w-[84px] flex-shrink-0 h-10 gap-2 px-3 rounded-[6px] text-primary-700 border-primary-200 hover:bg-primary-50 text-sm font-semibold shadow-none">
      <Pencil className="w-3.5 h-3.5" /> Edit
    </Button>
  );
}

/** Section wrapper: icon + title + edit button + children */
function SectionBlock({ icon, title, isEditing, onEdit, onCancel, children, bordered = true }: {
  icon: React.ReactNode; title: string;
  isEditing: boolean; onEdit: () => void; onCancel: () => void;
  children: React.ReactNode; bordered?: boolean;
}) {
  return (
    <div className={`flex flex-col py-8 ${bordered ? "border-b border-primary-100" : "pb-16"}`}>
      <div className="flex justify-between items-center w-full mb-6">
        <div className="flex items-center gap-2.5 text-[#689300] font-bold text-[16px]">
          {icon} {title}
        </div>
        <EditButton isEditing={isEditing} onEdit={onEdit} onCancel={onCancel} />
      </div>
      {children}
    </div>
  );
}

/** Security dropdown (shared by IMAP & SMTP) */
function SecuritySelect({ value, onChange }: { value?: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col">
      <label className="block text-[13px] text-primary-400 mb-1.5 font-normal">Security</label>
      <div className="relative">
        <select
          className="w-full h-12 px-4 border border-primary-100 rounded-xl outline-none appearance-none focus:border-primary-400 text-primary-900 dark:text-primary-100 bg-card text-[14px]"
          value={value} onChange={(e) => onChange(e.target.value)}>
          <option>SSL/TLS</option>
          <option>STARTTLS</option>
          <option>None</option>
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400 pointer-events-none" />
      </div>
    </div>
  );
}

/** Edit form for IMAP or SMTP (host, port, security, username, password) */
function MailConfigEditForm({ hostLabel, passwordLabel, data, onChange }: {
  hostLabel: string; passwordLabel: string;
  data: { host?: string; port?: string; security?: string; username?: string; password?: string };
  onChange: (field: string, value: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-4 gap-4 w-full">
        <div><Input label={hostLabel}  value={data.host}     className="w-full" onChange={(e: any) => onChange("host",     e.target.value)} /></div>
        <div><Input label="Port"        value={data.port}     className="w-full" onChange={(e: any) => onChange("port",     e.target.value)} /></div>
        <SecuritySelect value={data.security} onChange={(v) => onChange("security", v)} />
        <div><Input label="Username"    value={data.username} className="w-full" onChange={(e: any) => onChange("username", e.target.value)} /></div>
      </div>
      <div className="grid grid-cols-4 gap-4 w-full">
        <div>
          <Input type="password" label={passwordLabel} placeholder="Enter Password"
            className="w-full focus:placeholder:text-transparent"
            value={data.password || ""} onChange={(e: any) => onChange("password", e.target.value)} />
        </div>
      </div>
    </div>
  );
}

/** View fields for IMAP or SMTP */
function MailConfigViewFields({ hostName, passwordLabel, hostFallback, portFallback, data, showPassword, onTogglePassword }: {
  hostName: string; passwordLabel: string; hostFallback: string; portFallback: string;
  data: { host?: string; port?: string; security?: string; username?: string; password?: string };
  showPassword: boolean; onTogglePassword: () => void;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 gap-6 w-full">
        <ViewField label={hostName}   value={data.host}     fallback={hostFallback} />
        <ViewField label="Port"       value={data.port}     fallback={portFallback} />
        <ViewField label="Security"   value={data.security} fallback="SSL/TLS" />
        <ViewField label="Username"   value={data.username} fallback="Mohamed" />
      </div>
      <div className="grid grid-cols-4 gap-6 w-full">
        <PasswordField label={passwordLabel} value={data.password} show={showPassword} onToggle={onTogglePassword} />
      </div>
    </div>
  );
}

// ─── Main StepSummary Component ─────────────────────────────────────────────

export function StepSummary({ formData = {} as any, handleChange = () => {} }: WizardStepProps) {
  const [editMailbox,  setEditMailbox]  = useState(false);
  const [editImap,     setEditImap]     = useState(false);
  const [editSmtp,     setEditSmtp]     = useState(false);
  const [editAdvanced, setEditAdvanced] = useState(false);
  const [showSyncDropdown,  setShowSyncDropdown]  = useState(false);
  const [showImapPassword,  setShowImapPassword]  = useState(false);
  const [showSmtpPassword,  setShowSmtpPassword]  = useState(false);

  // Helper to map prefixed formData fields into a { host, port, security, username, password } shape
  const imapData = { host: formData.imapHost, port: formData.imapPort, security: formData.imapSecurity, username: formData.imapUsername, password: formData.imapPassword };
  const smtpData = { host: formData.smtpHost, port: formData.smtpPort, security: formData.smtpSecurity, username: formData.smtpUsername, password: formData.smtpPassword };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center text-left">
      <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">Summary</Text>
      <Text size="sm" font="normal" className="text-primary-400 text-center mb-14 tracking-wide">Please review your data before confirming</Text>

      <div className="w-full max-w-[900px] flex flex-col mx-auto bg-card mb-8">

        {/* ── Mailbox Name ── */}
        <SectionBlock icon={<Mail className="w-5 h-5 stroke-[2.5]" />} title="Mailbox Name"
          isEditing={editMailbox} onEdit={() => setEditMailbox(true)} onCancel={() => setEditMailbox(false)}>
          {editMailbox ? (
            <div className="grid grid-cols-4 gap-6 w-full">
              <div className="col-span-1">
                <Input label="Mailbox Name" required value={formData.mailboxName} className="w-full"
                  onChange={(e: any) => handleChange("mailboxName", e.target.value)} />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6 w-full">
              <ViewField label="Mailbox Name" value={formData.mailboxName} fallback="MO" />
              <ViewField label="Email Address" value="mohamed@yahoo.com" />
            </div>
          )}
        </SectionBlock>

        {/* ── IMAP Config ── */}
        <SectionBlock icon={<Settings className="w-5 h-5 stroke-[2.5]" />} title="IMAP Config"
          isEditing={editImap} onEdit={() => setEditImap(true)} onCancel={() => setEditImap(false)}>
          {editImap ? (
            <MailConfigEditForm
              hostLabel="IMAP Host" passwordLabel="Password"
              data={imapData}
              onChange={(field, value) => handleChange(`imap${field.charAt(0).toUpperCase() + field.slice(1)}` as any, value)}
            />
          ) : (
            <MailConfigViewFields
              hostName="IMAP Host" hostFallback="Imap.Company.Com" portFallback="995"
              passwordLabel="Password" data={imapData}
              showPassword={showImapPassword} onTogglePassword={() => setShowImapPassword(p => !p)}
            />
          )}
        </SectionBlock>

        {/* ── SMTP Config ── */}
        <SectionBlock icon={<Settings className="w-5 h-5 stroke-[2.5]" />} title="SMTP Config"
          isEditing={editSmtp} onEdit={() => setEditSmtp(true)} onCancel={() => setEditSmtp(false)}>
          {editSmtp ? (
            <MailConfigEditForm
              hostLabel="SMTP Host" passwordLabel="App Password"
              data={smtpData}
              onChange={(field, value) => handleChange(`smtp${field.charAt(0).toUpperCase() + field.slice(1)}` as any, value)}
            />
          ) : (
            <MailConfigViewFields
              hostName="SMTP Host" hostFallback="Smtp.Company.Com" portFallback="465"
              passwordLabel="App Password" data={smtpData}
              showPassword={showSmtpPassword} onTogglePassword={() => setShowSmtpPassword(p => !p)}
            />
          )}
        </SectionBlock>

        {/* ── Advanced Settings ── */}
        <SectionBlock icon={<Rocket className="w-5 h-5 stroke-[2.5] text-[#689300]" />} title="Advanced Settings"
          isEditing={editAdvanced} onEdit={() => setEditAdvanced(true)} onCancel={() => setEditAdvanced(false)} bordered={false}>
          {editAdvanced ? (
            <div className="grid grid-cols-4 gap-6 w-full">
              <div>
                <label className="block text-[13px] text-primary-400 mb-1.5 font-normal">Sync Interval (Minutes)</label>
                <div className="relative">
                  <button type="button" onClick={() => setShowSyncDropdown(!showSyncDropdown)}
                    className="w-full h-[52px] flex items-center justify-between px-5 border border-primary-200 rounded-[16px] outline-none text-primary bg-card hover:border-primary-300 transition-colors">
                    <span className="text-[14px] font-medium text-primary-700">
                      {formData.syncInterval ? `${formData.syncInterval} Minutes` : "Select From The List"}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${showSyncDropdown ? "rotate-180" : ""}`} />
                  </button>
                  {showSyncDropdown && (
                    <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-primary-50 rounded-[16px] z-50 flex flex-col p-2 gap-1 animate-in fade-in zoom-in-95 duration-150 shadow-sm border border-primary-100">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <button key={i} type="button"
                          onClick={() => { handleChange("syncInterval", i.toString()); setShowSyncDropdown(false); }}
                          className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-[12px] transition-colors hover:bg-primary-200/60 ${formData.syncInterval === i.toString() ? "bg-primary-200/40 text-primary-900" : "text-primary-500"}`}>
                          <span className="text-[14px] font-medium">{i} Minutes</span>
                          <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-6 w-full">
              <ViewField label="Sync Interval (Minutes)"
                value={formData.syncInterval ? `${formData.syncInterval} Minutes` : undefined}
                fallback="Not Set" />
            </div>
          )}
        </SectionBlock>

      </div>
    </div>
  );
}
