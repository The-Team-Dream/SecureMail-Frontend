import React from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { WizardStepProps } from "../../../../../schemas/CustomAccount";

interface StepProviderProps extends WizardStepProps {
  provider: "GMAIL" | "OUTLOOK" | "IMAP";
  setProvider: (provider: "GMAIL" | "OUTLOOK" | "IMAP") => void;
  onOAuthConnect?: (provider: "GMAIL" | "OUTLOOK") => void;
  isOAuthLoading?: boolean;
}

export function StepProvider({
  provider,
  setProvider,
  register,
  errors,
  clearErrors,
  onOAuthConnect,
}: StepProviderProps) {
  return (
    <div className="w-full flex flex-col items-center">
      <Text as="h2" size="3xl" font="normal" className="mb-2.5">
        Mailbox Name
      </Text>
      <Text
        size="sm"
        font="normal"
        color={"primary-500"}
        className=" text-center mb-10"
      >
        Please add the below data to complete adding your account
      </Text>

      <div className="w-full flex flex-col gap-8 text-left">
        <div className="flex flex-col gap-4">
          <Input
            label="Mailbox Name"
            placeholder="Mailbox Name"
            {...(register ? register("mailboxName", { onChange: () => clearErrors?.("mailboxName") }) : {})}
            error={errors?.mailboxName?.message}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm text-primary-400 mb-1">
            Provider Type{" "}
            <span className="text-error-500 font-semibold">*</span>
          </label>
          <div className="flex items-center justify-between max-w-sm mt-3">
            {(
              [
                { id: "GMAIL", label: "Gmail" },
                { id: "OUTLOOK", label: "Outlook" },
                { id: "IMAP", label: "Custom IMAP" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="flex items-center gap-2.5 cursor-pointer group bg-transparent border-0 p-0 outline-none"
                onClick={() => {
                  setProvider(opt.id);
                  if (opt.id !== "IMAP") {
                    onOAuthConnect?.(opt.id);
                  }
                }}
              >
                <div
                  className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all bg-card border-2 ${provider === opt.id ? "border-primary" : "border-primary-400 group-hover:border-primary"}`}
                >
                  {provider === opt.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  )}
                </div>
                <Text
                  size="sm"
                  className={`pt-px font-medium tracking-wide shrink-0 ${provider === opt.id ? "text-primary" : "text-primary-400"}`}
                >
                  {opt.label}
                </Text>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}