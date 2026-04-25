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
  onSuccess?: (data: WizardFormData, provider: string) => void;
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
    clearErrors,
    formState: { errors },
  } = useForm<WizardFormData>({
    resolver: zodResolver(wizardSchema),
    mode: "onBlur",
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
    if (step === 4) fieldsToValidate = ["syncInterval"];

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
          onSuccess?.(formData, provider);
          onCancel();
        }}
        resetWizard={resetWizard}
      />
    );
  }

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-card relative">
      <div className="flex items-center gap-2.5 px-10 py-3 w-full bg-ghostBlue border-b border-primary-100/80 z-10">
        <button onClick={onCancel} className="hover:underline cursor-pointer">
          <Text font="semiBold" size="sm">
            My Accounts
          </Text>
        </button>
        <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px]" />
        <Text color={"primary-400"} font={"medium"} size="sm">
          Add Account
        </Text>
      </div>

      <div className="flex flex-col flex-1 w-full mx-auto px-10 max-w-8xl pt-6">
        <WizardProgress step={step} steps={steps} />
        <hr className="h-px bg-primary-100 w-full absolute left-0 top-32" />
        <div
          className={`flex flex-col mb-8 w-full mx-auto flex-1 mt-8 ${step === 5 ? "max-w-[900px]" : "max-w-[560px]"}`}
        >
          {step === 1 && (
            <StepProvider
              formData={formData}
              handleChange={handleChange}
              provider={provider}
              setProvider={setProvider}
              register={register}
              clearErrors={clearErrors}
              errors={errors}
            />
          )}
          {step === 2 && (
            <StepIMAP
              formData={formData}
              handleChange={handleChange}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
            />
          )}
          {step === 3 && (
            <StepSMTP
              formData={formData}
              handleChange={handleChange}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
            />
          )}
          {step === 4 && (
            <StepAdvanced formData={formData} handleChange={handleChange} errors={errors} />
          )}
          {step === 5 && (
            <StepSummary formData={formData} handleChange={handleChange} />
          )}
        </div>

        <div className="flex justify-between items-center w-full py-6 pb-8 relative z-20">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1}
            className={`w-[110px] h-[46px] border-primary-200 text-primary-800 font-semibold shadow-sm ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          <Button
            onClick={handleNext}
            className="w-[110px] h-[46px] font-semibold"
          >
            {step === 5 ? "Save" : "Next"} <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
