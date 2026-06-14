"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Save, Loader2, ChevronDown, ChevronRight } from "lucide-react";
import { WizardFormData } from "@/schemas/CustomAccount";
import {
  SectionBlock,
  ViewField,
  AdvancedDraft,
} from "@/_components/wizard-summary/Shared";
import { Icons } from "@/constants/icons";

import { FieldErrors } from "react-hook-form";
import Error from "@/_components/shared/Error";
export function AdvancedSection({
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
  const [showSyncDropdown, setShowSyncDropdown] = useState(false);
  const [draft, setDraft] = useState<AdvancedDraft>({ syncInterval: "" });

  const handleEdit = () => {
    setDraft({ syncInterval: formData.syncInterval || "" });
    setIsEditing(true);
  };

  const handleCancel = () => {
    handleChange("syncInterval", draft.syncInterval);
    setShowSyncDropdown(false);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (validateFields) {
      const isValid = await validateFields(["syncInterval"]);
      if (!isValid) return;
    }
    setShowSyncDropdown(false);
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setIsSaving(false);
    setIsEditing(false);
  };

  const syncLabel = formData.syncInterval
    ? `${formData.syncInterval} Minutes`
    : "Select From The List";

  return (
    <SectionBlock
      icon={<Icons.Rocket className="w-5 h-5 text-secondary-800" />}
      title="Advanced Settings"
      isEditing={isEditing}
      onEdit={handleEdit}
      onCancel={handleCancel}
      bordered={false}
    >
      {isEditing ? (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-[13px] text-primary-400 mb-1.5 font-normal">
              Sync Interval (Minutes)
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowSyncDropdown(!showSyncDropdown)}
                className="w-full h-[52px] flex items-center justify-between px-5 border border-primary-200 rounded-[16px] outline-none text-primary cursor-pointer hover:border-primary-300 transition-colors"
              >
                <span className="text-[14px] font-medium text-primary-700">
                  {syncLabel}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-primary-400 transition-transform duration-200 ${showSyncDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showSyncDropdown && (
                <div className="absolute top-[calc(100%+8px)] left-0 w-full bg-primary-50 rounded-[16px] z-50 flex flex-col p-2 gap-1 animate-in fade-in zoom-in-95 duration-150 shadow-sm border border-primary-100">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={`summary-interval-${i}`}
                      type="button"
                      onClick={() => {
                        handleChange("syncInterval", i.toString());
                        clearErrors?.("syncInterval");
                        setShowSyncDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left rounded-[12px] transition-colors cursor-pointer hover:bg-primary-200/60 ${formData.syncInterval === i.toString() ? "bg-primary-200/40 text-primary-900" : "text-primary-500"}`}
                    >
                      <span className="text-[14px] font-medium">
                        {i} Minutes
                      </span>
                      <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Error error={errors?.syncInterval?.message} />
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
        <div className="grid grid-cols-4 text-nowrap gap-6 w-full">
          <ViewField
            label="Sync Interval (Minutes)"
            value={
              formData.syncInterval
                ? `${formData.syncInterval} Minutes`
                : undefined
            }
            fallback="Not Set"
          />
        </div>
      )}
    </SectionBlock>
  );
}
