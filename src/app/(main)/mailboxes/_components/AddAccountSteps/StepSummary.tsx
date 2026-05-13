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
import { IMAPSection } from "@/_components/wizard-summary/IMAPSection";
import { SMTPSection } from "@/_components/wizard-summary/SMTPSection";
import { AdvancedSection } from "@/_components/wizard-summary/AdvancedSection";

interface StepSummaryProps extends WizardStepProps {
  handleImapSubmit?: () => Promise<void>;
  isPending?: boolean;
}

export function StepSummary({
  formData = {} as WizardFormData,
  handleChange = () => {},
  handleImapSubmit,
}: StepSummaryProps) {
  const [showImapPassword, setShowImapPassword] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    defaultValues: formData,
    mode: "all",
  });

  const localFormData = watch();

  const localHandleChange = (field: keyof WizardFormData, value: string) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
    handleChange(field, value);
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

      <div className="w-full max-w-[900px] flex flex-col mx-auto bg-card mb-8">
        <MailboxSection
          formData={localFormData}
          handleChange={localHandleChange}
          errors={errors}
        />

        <IMAPSection
          formData={localFormData}
          handleChange={localHandleChange}
          showPassword={showImapPassword}
          onTogglePassword={() => setShowImapPassword((p) => !p)}
          errors={errors}
        />

        <SMTPSection
          formData={localFormData}
          handleChange={localHandleChange}
          showPassword={showSmtpPassword}
          onTogglePassword={() => setShowSmtpPassword((p) => !p)}
          errors={errors}
        />

        <AdvancedSection
          formData={localFormData}
          handleChange={localHandleChange}
          errors={errors}
        />
      </div>
    </form>
  );
}