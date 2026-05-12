"use client";

import React, { useState } from "react";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Mail, Save, Loader2 } from "lucide-react";
import { WizardFormData } from "@/schemas/CustomAccount";
import { SectionBlock, ViewField, MailboxDraft } from "@/_components/wizard-summary/Shared";
import { Icons } from "@/constants/icons";

import { FieldErrors } from "react-hook-form";

export function MailboxSection({
  formData,
  handleChange,
  errors,
}: {
  formData: WizardFormData;
  handleChange: (field: keyof WizardFormData, value: string) => void;
  errors?: FieldErrors<WizardFormData>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<MailboxDraft>({
    mailboxName: "",
    emailAddress: "",
  });

  const handleEdit = () => {
    setDraft({
      mailboxName: formData.mailboxName || "",
      emailAddress: formData.emailAddress || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    handleChange("mailboxName", draft.mailboxName);
    handleChange("emailAddress", draft.emailAddress);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call / save logic
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setIsEditing(false);
  };

  return (
    <SectionBlock
      icon={<Icons.Mail className="w-5 h-5 text-secondary-800" />}
      title="Mailbox Name"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-6 w-full">
            <div className="col-span-1">
              <Input
                label="Mailbox Name"
                value={formData.mailboxName}
                className="w-full"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("mailboxName", e.target.value)
                }
                error={errors?.mailboxName?.message}
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Email Address"
                value={formData.emailAddress || ""}
                className="w-full"
                placeholder="you@example.com"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("emailAddress", e.target.value)
                }
                error={errors?.emailAddress?.message}
              />
            </div>
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
        <div className="grid grid-cols-4 gap-6 w-full">
          <ViewField
            label="Mailbox Name"
            value={formData.mailboxName}
            fallback="—"
          />
          <ViewField
            label="Email Address"
            value={formData.emailAddress}
            fallback="—"
          />
        </div>
      )}
    </SectionBlock>
  );
}
