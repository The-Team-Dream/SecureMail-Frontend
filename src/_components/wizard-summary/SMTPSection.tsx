"use client";

import React, { useState } from "react";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Settings, Save, Loader2 } from "lucide-react";
import { WizardFormData } from "@/app/dashboard/mailboxes/_components/wizard-steps/WizardTypes";
import {
  SectionBlock,
  ViewField,
  PasswordField,
  SecuritySelect,
  MailConfigDraft,
} from "./Shared";

export function SMTPSection({
  formData,
  handleChange,
  showPassword,
  onTogglePassword,
}: {
  formData: WizardFormData;
  handleChange: (field: keyof WizardFormData, value: string) => void;
  showPassword: boolean;
  onTogglePassword: () => void;
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
    setDraft({
      host: formData.smtpHost || "",
      port: formData.smtpPort || "",
      security: formData.smtpSecurity || "SSL/TLS",
      username: formData.smtpUsername || "",
      password: formData.smtpPassword || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    handleChange("smtpHost", draft.host);
    handleChange("smtpPort", draft.port);
    handleChange("smtpSecurity", draft.security);
    handleChange("smtpUsername", draft.username);
    handleChange("smtpPassword", draft.password);
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
      icon={<Settings className="w-5 h-5 stroke-[2.5]" />}
      title="SMTP Config"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4 w-full">
            <Input
              label="SMTP Host"
              value={formData.smtpHost}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("smtpHost", e.target.value)
              }
            />
            <Input
              label="Port"
              value={formData.smtpPort}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("smtpPort", e.target.value)
              }
            />
            <SecuritySelect
              value={formData.smtpSecurity}
              onChange={(v) => handleChange("smtpSecurity", v)}
            />
            <Input
              label="Username"
              value={formData.smtpUsername || ""}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("smtpUsername", e.target.value)
              }
            />
          </div>
          <div className="grid grid-cols-4 gap-4 w-full">
            <Input
              type="password"
              label="App Password"
              value={formData.smtpPassword || ""}
              className="w-full"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChange("smtpPassword", e.target.value)
              }
            />
          </div>
          <div className="flex justify-end">
            <Button size={"sm"} className="w-fit" onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-4 gap-6 w-full">
            <ViewField
              label="SMTP Host"
              value={formData.smtpHost}
              fallback="Smtp.Company.Com"
            />
            <ViewField label="Port" value={formData.smtpPort} fallback="465" />
            <ViewField
              label="Security"
              value={formData.smtpSecurity}
              fallback="SSL/TLS"
            />
            <ViewField label="Username" value={formData.smtpUsername} />
          </div>
          <div className="grid grid-cols-4 gap-6 w-full">
            <PasswordField
              label="App Password"
              value={formData.smtpPassword}
              show={showPassword}
              onToggle={onTogglePassword}
            />
          </div>
        </div>
      )}
    </SectionBlock>
  );
}
