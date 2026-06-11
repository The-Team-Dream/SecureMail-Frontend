"use client";
import { motion } from "framer-motion";
import { Text } from "@/_components/shared/Text";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, ChevronRight, Loader2 } from "lucide-react";
import { WizardFormData } from "../../../../schemas/CustomAccount";
import { WizardProgress } from "./AddAccountSteps/WizardProgress";
import { StepProvider } from "./AddAccountSteps/StepProvider";
import { StepImapSmtp } from "./AddAccountSteps/StepImapSmtp";
import { StepAdvanced } from "./AddAccountSteps/StepAdvanced";
import { StepSummary } from "./AddAccountSteps/StepSummary";
import { StepSuccess } from "./AddAccountSteps/StepSuccess";
import { useAddAccountWizard } from "../../../../hooks/useAddAccountWizard";
import React from "react";

interface AddAccountWizardProps {
  onCancel: () => void;
  onSuccess?: (data: WizardFormData, provider: string) => void;
}

export function AddAccountWizard({
  onCancel,
  onSuccess,
}: AddAccountWizardProps) {
  const {
    step,
    provider,
    setProvider,
    formData,
    register,
    errors,
    clearErrors,
    steps,
    handleNext,
    handlePrev,
    goToStep,
    handleCancel,
    handleChange,
    handleImapSubmit,
    handleSuccessCancel,
    handleResetWizard,
    isOAuthLoading,
    isImapLoading,
    isOAuthProvider,
    nextButtonLabel,
    currentStepTitle,
  } = useAddAccountWizard({ onCancel, onSuccess });

  if (step === 5) {
    return (
      <StepSuccess
        onCancel={handleSuccessCancel}
        resetWizard={handleResetWizard}
      />
    );
  }

  const isLoading = isOAuthLoading || isImapLoading;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col w-full min-h-[calc(100vh-80px)] bg-background relative"
    >
      <div className="flex items-center gap-2.5 px-10 py-3 w-full bg-ghostBlue border-b border-primary-100/80 z-10 flex-wrap">
        <button
          onClick={handleCancel}
          className="hover:underline cursor-pointer shrink-0"
        >
          <Text font="semiBold" size="sm">
            My Accounts
          </Text>
        </button>
        <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px] shrink-0" />
        
        {/* We can make "Add Account" always go to step 1 if we are further along */}
        {step > 1 ? (
          <button
            onClick={() => goToStep(1)}
            className="hover:underline cursor-pointer shrink-0"
          >
            <Text font="semiBold" size="sm">
              Add Account
            </Text>
          </button>
        ) : (
          <Text font="semiBold" size="sm" className="shrink-0">
            Add Account
          </Text>
        )}

        {/* Accumulate the steps up to the current one */}
        {steps.slice(0, step).map((s) => {
          const isLast = s.id === step;
          return (
            <React.Fragment key={`bc-step-${s.id}`}>
              <ChevronRight className="w-4 h-4 text-primary-400 stroke-[2.5px] shrink-0" />
              {!isLast ? (
                <button
                  onClick={() => goToStep(s.id)}
                  className="hover:underline cursor-pointer shrink-0"
                >
                  <Text font="semiBold" size="sm">
                    {s.title}
                  </Text>
                </button>
              ) : (
                <Text color={"primary-400"} font={"medium"} size="sm" className="shrink-0">
                  {s.title}
                </Text>
              )}
            </React.Fragment>
          );
        })}
      </div>

      <div className="flex flex-col flex-1 w-full mx-auto px-10 max-w-8xl pt-6">
        <WizardProgress step={step} steps={steps} goToStep={goToStep} />
        <hr className="h-px bg-primary-100 w-full absolute left-0 top-32" />

        <div
          className={`flex flex-col mb-8 w-full mx-auto flex-1 mt-8 ${step === 4 ? "max-w-[900px]" : "max-w-[560px]"}`}
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
              onOAuthConnect={handleNext}
              isOAuthLoading={isOAuthLoading}
            />
          )}
          {step === 2 && (
            <StepImapSmtp
              formData={formData}
              handleChange={handleChange}
              register={register}
              errors={errors}
              clearErrors={clearErrors}
            />
          )}
          {step === 3 && (
            <StepAdvanced
              formData={formData}
              handleChange={handleChange}
              errors={errors}
            />
          )}
          {step === 4 && (
            <StepSummary 
              formData={formData} 
              handleChange={handleChange} 
              onPrev={handlePrev} 
              handleImapSubmit={handleImapSubmit}
              isPending={isImapLoading}
            />
          )}
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between items-center w-full py-6 pb-8 relative z-20">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrev}
            disabled={step === 1 || isLoading}
            className={`w-[110px] h-[46px] border-primary-200 text-primary-800 font-semibold shadow-sm ${step === 1 ? "opacity-0 pointer-events-none" : ""}`}
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </Button>

          {!(step === 1 && isOAuthProvider) && (
            <Button
              type={step === 4 ? "submit" : "button"}
              form={step === 4 ? "summary-form" : undefined}
              onClick={step === 4 ? undefined : () => handleNext()}
              disabled={isLoading}
              className="min-w-[130px] h-[46px] font-semibold gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {nextButtonLabel}
              {!isLoading && <ArrowRight className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}