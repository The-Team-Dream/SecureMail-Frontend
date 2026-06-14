"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Text } from "@/_components/shared/Text";
import {
  WizardFormData,
  wizardSchema,
  WizardStepProps,
} from "../../../../../schemas/CustomAccount";
import { MailboxSection } from "@/_components/wizard-summary/MailboxSection";
import { ImapSmtpSection } from "@/_components/wizard-summary/ImapSmtpSection";
import { AdvancedSection } from "@/_components/wizard-summary/AdvancedSection";

interface StepSummaryProps extends WizardStepProps {
  handleImapSubmit?: () => Promise<void>;
  isPending?: boolean;
}

export interface SectionProps {
  formData: WizardFormData;
  handleChange: (field: keyof WizardFormData, value: string) => void;
  errors?: any;
  clearErrors?: any;
  handleBlur?: (field: keyof WizardFormData) => void;
  validateFields?: (fields: (keyof WizardFormData)[]) => Promise<boolean>;
  showPassword?: boolean;
  onTogglePassword?: () => void;
}

export function StepSummary({
  formData = {} as WizardFormData,
  handleChange = () => {},
  handleImapSubmit,
}: StepSummaryProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    trigger,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: formData,
    mode: "onBlur",
  });

  const localFormData = watch();

  const localHandleChange = (field: keyof WizardFormData, value: string) => {
    setValue(field, value, { shouldValidate: false, shouldDirty: true });
    handleChange(field, value);
  };

  const localHandleBlur = (field: keyof WizardFormData) => {
    trigger(field);
  };

  const validateFields = async (fields: (keyof WizardFormData)[]) => {
    return await trigger(fields);
  };

  const onSubmit = async () => {
    if (handleImapSubmit) {
      await handleImapSubmit();
    }
  };

  return (
    <form
      id="summary-form"
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col items-center w-full"
    >
      <Text
        as="h2"
        size="4xl"
        font="normal"
        className="text-center mb-2.5 tracking-tight"
      >
        Summary
      </Text>
      <Text
        size="sm"
        font="normal"
        color={"primary-500"}
        className="text-center mb-10 tracking-wide"
      >
        Please review your data before confirming
      </Text>

      <div className="w-full flex flex-col mx-auto mb-2">
        <MailboxSection
          formData={localFormData}
          handleChange={localHandleChange}
          errors={errors}
          clearErrors={clearErrors}
          handleBlur={localHandleBlur}
          validateFields={validateFields}
        />

        <ImapSmtpSection
          formData={localFormData}
          handleChange={localHandleChange}
          errors={errors}
          clearErrors={clearErrors}
          handleBlur={localHandleBlur}
          validateFields={validateFields}
        />

        <AdvancedSection
          formData={localFormData}
          handleChange={localHandleChange}
          errors={errors}
          clearErrors={clearErrors}
          handleBlur={localHandleBlur}
          validateFields={validateFields}
        />
      </div>
    </form>
  );
}
