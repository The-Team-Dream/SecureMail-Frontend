"use client";

import React, { useState } from "react";
import { Input } from "@/_components/shared/Input";
import { Button } from "@/components/ui/button";
import { Mail, Save, Loader2 } from "lucide-react";
import { WizardFormData } from "@/schemas/CustomAccount";
import { SectionBlock, ViewField, MailboxDraft } from "./Shared";
import { Icons } from "@/constants/icons";

export function MailboxSection({
  formData,
  handleChange,
}: {
  formData: WizardFormData;
  handleChange: (field: keyof WizardFormData, value: string) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<MailboxDraft>({
    mailboxName: "",
    mailboxEmail: "",
  });

  const handleEdit = () => {
    setDraft({
      mailboxName: formData.mailboxName || "",
      mailboxEmail: formData.mailboxEmail || "",
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    handleChange("mailboxName", draft.mailboxName);
    handleChange("mailboxEmail", draft.mailboxEmail);
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
                required
                value={formData.mailboxName}
                className="w-full"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("mailboxName", e.target.value)
                }
              />
            </div>
            <div className="col-span-1">
              <Input
                label="Email Address"
                value={formData.mailboxEmail || ""}
                className="w-full"
                placeholder="you@example.com"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChange("mailboxEmail", e.target.value)
                }
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button
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
            value={formData.mailboxEmail}
            fallback="—"
          />
        </div>
      )}
    </SectionBlock>
  );
}
