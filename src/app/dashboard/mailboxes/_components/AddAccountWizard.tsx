"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import {
  Mail,
  Settings,
  Lock,
  Rocket,
  FileText,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import { WizardFormData, wizardSchema } from "./wizard-steps/WizardTypes";
import { WizardProgress } from "./wizard-steps/WizardProgress";
import { StepProvider } from "./wizard-steps/StepProvider";
import { StepIMAP } from "./wizard-steps/StepIMAP";
import { StepSMTP } from "./wizard-steps/StepSMTP";
import { StepAdvanced } from "./wizard-steps/StepAdvanced";
import { StepSummary } from "./wizard-steps/StepSummary";
import { StepSuccess } from "./wizard-steps/StepSuccess";

interface AddAccountWizardProps {
  onCancel: () => void;
  onSuccess?: () => void;
}

export function AddAccountWizard({
  onCancel,
  onSuccess,
}: AddAccountWizardProps) {
  const [step, setStep] = useState(1);
  const [provider, setProvider] = useState("Gmail");

  const {
    register,
    trigger,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: "onTouched",
    defaultValues: {
      mailboxName: "",
      emailAddress: "",
      imapHost: "",
      imapPort: "",
      imapSecurity: "SSL/TLS",
      imapUsername: "",
      imapPassword: "",
      smtpHost: "",
      smtpPort: "",
      smtpSecurity: "SSL/TLS",
      smtpUsername: "",
      smtpPassword: "",
      syncInterval: "",
    },
  });

  const formData = watch();

  const handleChange = (field: keyof WizardFormData, value: string) => {
    setValue(field, value, { shouldValidate: true, shouldDirty: true });
  };

  const resetWizard = () => {
    setStep(1);
    reset();
  };

  const steps = [
    { id: 1, icon: Mail },
    { id: 2, icon: Settings },
    { id: 3, icon: Lock },
    { id: 4, icon: Rocket },
    { id: 5, icon: FileText },
  ];

  const validateStep = async () => {
    let fieldsToValidate: (keyof WizardFormData)[] = [];
    if (step === 1) fieldsToValidate = ["mailboxName"];
    if (step === 2) fieldsToValidate = ["imapHost", "imapPort", "imapSecurity"];
    if (step === 3) fieldsToValidate = ["smtpHost", "smtpPort", "smtpSecurity"];

    if (fieldsToValidate.length > 0) {
      return await trigger(fieldsToValidate);
    }
    return true;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    if (!isValid) return;

    if (step === 1) {
      if (provider === "Gmail") {
        alert("Redirecting to Google OAuth...");
        return;
      }
      if (provider === "Outlook") {
        alert("Redirecting to Microsoft OAuth...");
        return;
      }
    }
    if (step === 5) {
      setStep(6); // Go to Success page first, onSuccess called from there
    } else if (step < 6) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  if (step === 6) {
    return (
      <StepSuccess
        onCancel={() => {
          onSuccess?.();
          onCancel();
        }}
        resetWizard={resetWizard}
      />
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-card relative">
      <div className="flex items-center gap-2.5 px-10 py-5 w-full bg-primary-50 border-b border-primary-100/80 z-10">
        <button onClick={onCancel} className="hover:underline">
          <Text font="semiBold" size="sm" className="text-primary-900">
            My Accounts
          </Text>
        </button>
        <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
        <Text className="text-primary-400 font-medium tracking-wide" size="sm">
          Add Account
        </Text>
      </div>

      <div className="flex flex-col flex-1 w-full mx-auto px-10 max-w-6xl pt-6">
        <WizardProgress step={step} steps={steps} />

        <div
          className={`flex flex-col mb-16 w-full mx-auto flex-1 mt-14 ${step === 5 ? "max-w-[900px]" : "max-w-[560px]"}`}
        >
          {step === 1 && (
            <StepProvider
              formData={formData}
              handleChange={handleChange}
              provider={provider}
              setProvider={setProvider}
              register={register}
              errors={errors}
            />
          )}
          {step === 2 && (
            <StepIMAP
              formData={formData}
              handleChange={handleChange}
              register={register}
              errors={errors}
            />
          )}
          {step === 3 && (
            <StepSMTP
              formData={formData}
              handleChange={handleChange}
              register={register}
              errors={errors}
            />
          )}
          {step === 4 && (
            <StepAdvanced formData={formData} handleChange={handleChange} />
          )}
          {step === 5 && (
            <StepSummary formData={formData} handleChange={handleChange} />
          )}
        </div>

        <div className="flex justify-between items-center w-full py-6 pb-8 border-t border-transparent mt-auto relative z-20">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className={`w-[124px] px-6 h-[46px] rounded-[12px] bg-transparent border-primary-200 text-primary-700 hover:bg-primary-50 flex items-center justify-center gap-2 font-semibold transition-all shadow-sm ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <Button
            onClick={handleNext}
            className="w-[124px] px-6 h-[46px] bg-primary-900 text-primary-50 hover:bg-primary-800 rounded-[12px] flex items-center justify-center gap-2 font-semibold shadow-md"
          >
            {step === 5 ? "Save" : "Next"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
