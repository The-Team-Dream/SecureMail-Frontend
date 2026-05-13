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
  MailConfigDraft,
} from "@/_components/wizard-summary/Shared";
import { Icons } from "@/constants/icons";

import { FieldErrors } from "react-hook-form";

export function IMAPSection({
  formData,
  handleChange,
  showPassword,
  onTogglePassword,
  errors,
}: {
  formData: WizardFormData;
  handleChange: (field: keyof WizardFormData, value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
  errors?: FieldErrors<WizardFormData>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<MailConfigDraft>({
    host: "",
    port: "",
    security: "",
    username: "",
    password: "",
  });

  const handleEdit = () => {
    // Snapshot current values
    setDraft({
      host: formData.imapHost || "",
      port: formData.imapPort || "",
      security: formData.imapSecurity || "SSL/TLS",
      username: formData.imapUsername || "",
      password: formData.imapPassword || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    // Restore snapshot
    handleChange("imapHost", draft.host);
    handleChange("imapPort", draft.port);
    handleChange("imapSecurity", draft.security);
    handleChange("imapUsername", draft.username);
    handleChange("imapPassword", draft.password);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <SectionBlock
      icon={<Icons.Settings2 className="w-5 h-5 text-secondary-800" />}
      title="IMAP Config"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4 w-full">
            <Input
              label="IMAP Host"
              value={formData.imapHost}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("imapHost", e.target.value)
              }
              error={errors?.imapHost?.message}
            />
            <Input
              label="Port"
              type="number"
              value={formData.imapPort}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("imapPort", e.target.value)
              }
              error={errors?.imapPort?.message}
            />
            <SecuritySelect
              value={formData.imapSecurity}
              onChange={(v) => handleChange("imapSecurity", v)}
            />
            <Input
              label="Username"
              value={formData.imapUsername || ""}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("imapUsername", e.target.value)
              }
              error={errors?.imapUsername?.message}
            />
          </div>
          <div className="grid grid-cols-4 gap-4 w-full">
            <Input
              type="password"
              label="Password"
              value={formData.imapPassword || ""}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("imapPassword", e.target.value)
              }
              error={errors?.imapPassword?.message}
            />
          </div>
          <div className="flex justify-end">
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
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-6 w-full">
            <ViewField
              label="IMAP Host"
              value={formData.imapHost}
              fallback="Imap.Company.Com"
            />
            <ViewField label="Port" value={formData.imapPort} fallback="993" />
            <ViewField
              label="Security"
              value={formData.imapSecurity}
              fallback="SSL/TLS"
            />
            <ViewField label="Username" value={formData.imapUsername} />
          </div>
          <div className="grid grid-cols-4 gap-6 w-full">
            <PasswordField
              label="Password"
              value={formData.imapPassword}
              show={showPassword}
              onToggle={onTogglePassword}
            />
          </div>
        </div>
      )}
    </SectionBlock>
  );
}