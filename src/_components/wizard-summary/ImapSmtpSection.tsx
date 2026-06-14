"use client";

import React, { useState } from "react";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Save, Loader2 } from "lucide-react";
import { WizardFormData } from "@/schemas/CustomAccount";
import {
  SectionBlock,
  ViewField,
  PasswordField,
  SecuritySelect,
} from "@/_components/wizard-summary/Shared";
import { Icons } from "@/constants/icons";

import { FieldErrors } from "react-hook-form";

export function ImapSmtpSection({
  formData,
  handleChange,
  errors,
  clearErrors,
  handleBlur,
  validateFields,
}: {
  formData: WizardFormData;
  handleChange: (field: keyof WizardFormData, value: string) => void;
  errors?: FieldErrors<WizardFormData>;
  clearErrors?: any;
  handleBlur?: (field: keyof WizardFormData) => void;
  validateFields?: (fields: (keyof WizardFormData)[]) => Promise<boolean>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [draft, setDraft] = useState({
    email: "",
    imapHost: "",
    imapPort: "",
    encryption: "",
    smtpHost: "",
    smtpPort: "",
    password: "",
  });

  const handleEdit = () => {
    setDraft({
      email: formData.email || "",
      imapHost: formData.imapHost || "",
      imapPort: formData.imapPort || "",
      encryption: formData.encryption || "SSL/TLS",
      smtpHost: formData.smtpHost || "",
      smtpPort: formData.smtpPort || "",
      password: formData.password || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    handleChange("email", draft.email);
    handleChange("imapHost", draft.imapHost);
    handleChange("imapPort", draft.imapPort);
    handleChange("encryption", draft.encryption);
    handleChange("smtpHost", draft.smtpHost);
    handleChange("smtpPort", draft.smtpPort);
    handleChange("password", draft.password);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (validateFields) {
      const isValid = await validateFields([
        "email",
        "imapHost",
        "imapPort",
        "encryption",
        "smtpHost",
        "smtpPort",
        "password",
      ]);
      if (!isValid) return;
    }
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <SectionBlock
      icon={<Icons.Settings2 className="w-5 h-5 text-secondary-800" />}
      title="IMAP/SMTP Config"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <div className="flex flex-col gap-6">
          {/* Row 1: Email + App Password + Encryption */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
            <Input
              label="Email Address"
              value={formData.email || ""}
              className="w-full"
              onChange={(e) => {
                handleChange("email", e.target.value);
                clearErrors?.("email");
              }}
              onBlur={() => handleBlur?.("email")}
              error={errors?.email?.message}
            />
            <Input
              type="password"
              label="App Password"
              value={formData.password || ""}
              className="w-full"
              onChange={(e) => {
                handleChange("password", e.target.value);
                clearErrors?.("password");
              }}
              onBlur={() => handleBlur?.("password")}
              error={errors?.password?.message}
            />
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <SecuritySelect
                value={formData.encryption}
                onChange={(v) => {
                  handleChange("encryption", v);
                  clearErrors?.("encryption");
                }}
              />
            </div>
          </div>

          {/* Row 2: IMAP Settings (Label/Sub-heading) */}
          <div className="text-[13px] font-bold text-secondary-800 tracking-wider uppercase border-b border-primary-100/50 pb-1 mt-2">
            IMAP Settings
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Input
              label="IMAP Host"
              value={formData.imapHost || ""}
              className="w-full"
              onChange={(e) => {
                handleChange("imapHost", e.target.value);
                clearErrors?.("imapHost");
              }}
              onBlur={() => handleBlur?.("imapHost")}
              error={errors?.imapHost?.message}
            />
            <Input
              label="Port"
              type="number"
              value={formData.imapPort || ""}
              className="w-full"
              onChange={(e) => {
                handleChange("imapPort", e.target.value);
                clearErrors?.("imapPort");
              }}
              onBlur={() => handleBlur?.("imapPort")}
              error={errors?.imapPort?.message}
            />
          </div>

          {/* Row 3: SMTP Settings (Label/Sub-heading) */}
          <div className="text-[13px] font-bold text-secondary-800 tracking-wider uppercase border-b border-primary-100/50 pb-1 mt-2">
            SMTP Settings
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            <Input
              label="SMTP Host"
              value={formData.smtpHost || ""}
              className="w-full"
              onChange={(e) => {
                handleChange("smtpHost", e.target.value);
                clearErrors?.("smtpHost");
              }}
              onBlur={() => handleBlur?.("smtpHost")}
              error={errors?.smtpHost?.message}
            />
            <Input
              label="Port"
              type="number"
              value={formData.smtpPort || ""}
              className="w-full"
              onChange={(e) => {
                handleChange("smtpPort", e.target.value);
                clearErrors?.("smtpPort");
              }}
              onBlur={() => handleBlur?.("smtpPort")}
              error={errors?.smtpPort?.message}
            />
          </div>

          <div className="flex justify-end mt-2">
            <Button
              type="button"
              size={"sm"}
              className="w-fit"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Row 1: Email + App Password + Encryption */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            <ViewField label="Email Address" value={formData.email} />
            <PasswordField
              label="App Password"
              value={formData.password}
              show={showPassword}
              onToggle={() => setShowPassword((p) => !p)}
            />
            <ViewField
              label="Encryption"
              value={formData.encryption}
              fallback="SSL/TLS"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 md:gap-8 w-full">
            {/* IMAP Column */}
            <div className="flex flex-col gap-4 border border-primary-100/60 rounded-xl p-5 bg-ghostBlue/20">
              <div className="text-[10px] sm:text-xs font-bold text-secondary-800 tracking-wider uppercase border-b border-primary-100/40 pb-1.5 mb-2">
                IMAP Settings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ViewField
                  label="IMAP Host"
                  value={formData.imapHost}
                  fallback="imap.company.com"
                />
                <ViewField
                  label="Port"
                  value={formData.imapPort}
                  fallback="993"
                />
              </div>
            </div>

            {/* SMTP Column */}
            <div className="flex flex-col gap-4 border border-primary-100/60 rounded-xl p-5 bg-ghostBlue/20">
              <div className="text-[10px] sm:text-xs font-bold text-secondary-800 tracking-wider uppercase border-b border-primary-100/40 pb-1.5 mb-2">
                SMTP Settings
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <ViewField
                  label="SMTP Host"
                  value={formData.smtpHost}
                  fallback="smtp.company.com"
                />
                <ViewField
                  label="Port"
                  value={formData.smtpPort}
                  fallback="465"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </SectionBlock>
  );
}
