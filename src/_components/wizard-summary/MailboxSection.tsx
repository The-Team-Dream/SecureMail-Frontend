"use client";

import React, { useState } from "react";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Mail, Save, Loader2 } from "lucide-react";
import { WizardFormData } from "@/schemas/CustomAccount";
import {
  SectionBlock,
  ViewField,
  MailboxDraft,
} from "@/_components/wizard-summary/Shared";
import { Icons } from "@/constants/icons";

import { FieldErrors } from "react-hook-form";

export function MailboxSection({
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
  const [draft, setDraft] = useState({
    mailboxName: "",
  });

  const handleEdit = () => {
    setDraft({
      mailboxName: formData.mailboxName || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    handleChange("mailboxName", draft.mailboxName);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (validateFields) {
      const isValid = await validateFields(["mailboxName"]);
      if (!isValid) return;
    }
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
          <Input
            label="Mailbox Name"
            value={formData.mailboxName}
            className="w-full sm:w-fit"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              handleChange("mailboxName", e.target.value);
              clearErrors?.("mailboxName");
            }}
            onBlur={() => handleBlur?.("mailboxName")}
            error={errors?.mailboxName?.message}
          />
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
          <div className="col-span-2">
            <ViewField
              label="Mailbox Name"
              value={formData.mailboxName}
              fallback="—"
            />
          </div>
        </div>
      )}
    </SectionBlock>
  );
}
