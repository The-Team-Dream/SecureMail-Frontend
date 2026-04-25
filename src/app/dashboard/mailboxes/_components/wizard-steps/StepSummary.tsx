"use client";

import { useState } from "react";
import { Text } from "@/_components/shared/Text";
import { WizardFormData, WizardStepProps } from "./WizardTypes";
import { MailboxSection } from "@/_components/wizard-summary/MailboxSection";
import { IMAPSection } from "@/_components/wizard-summary/IMAPSection";
import { SMTPSection } from "@/_components/wizard-summary/SMTPSection";
import { AdvancedSection } from "@/_components/wizard-summary/AdvancedSection";

export function StepSummary({
  formData = {} as WizardFormData,
  handleChange = () => {},
}: WizardStepProps) {
  const [showImapPassword, setShowImapPassword] = useState(false);
  const [showSmtpPassword, setShowSmtpPassword] = useState(false);

  return (
    <div className="flex flex-col items-center">
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
        <MailboxSection formData={formData} handleChange={handleChange} />

        <IMAPSection
          formData={formData}
          handleChange={handleChange}
          showPassword={showImapPassword}
          onTogglePassword={() => setShowImapPassword((p) => !p)}
        />

        <SMTPSection
          formData={formData}
          handleChange={handleChange}
          showPassword={showSmtpPassword}
          onTogglePassword={() => setShowSmtpPassword((p) => !p)}
        />

        <AdvancedSection formData={formData} handleChange={handleChange} />
      </div>
    </div>
  );
}
