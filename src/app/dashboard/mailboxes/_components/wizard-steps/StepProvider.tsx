import React from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { WizardStepProps } from "./WizardTypes";

interface StepProviderProps extends WizardStepProps {
  provider: string;
  setProvider: (provider: string) => void;
}

export function StepProvider({
  formData,
  handleChange,
  provider,
  setProvider,
  register,
  errors,
}: StepProviderProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center">
      <Text
        as="h2"
        size="3xl"
        font="normal"
        className="text-center mb-2.5 text-primary-900 tracking-tight"
      >
        Mailbox Name
      </Text>
      <Text
        size="sm"
        font="normal"
        className="text-[#A1A1AA] text-center mb-14 tracking-wide"
      >
        Please add the below data to complete adding your account
      </Text>

      <div className="w-full flex flex-col gap-8 text-left">
        <div className="w-full">
          <Input
            label="Mailbox Name"
            required
            placeholder="Work Email"
            {...register("mailboxName")}
            error={errors?.mailboxName?.message}
          />
        </div>

        <div className="w-full">
          <label className="block text-sm text-primary-400 mb-1">
            Provider Type <span className="text-error-500 ml-1">*</span>
          </label>
          <div className="flex items-center justify-between w-full mt-3 border border-transparent">
            {[
              { id: "Gmail", label: "Gmail" },
              { id: "Outlook", label: "Outlook" },
              { id: "Custom IMAP", label: "Custom IMAP" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="flex items-center gap-2.5 cursor-pointer group bg-transparent border-0 p-0 outline-none"
                onClick={() => setProvider(opt.id)}
              >
                <div
                  className={`w-[20px] h-[20px] rounded-full flex items-center justify-center transition-all bg-card border-[1.5px] ${provider === opt.id ? "border-[#87BE00]" : "border-[#DFDFDF] group-hover:border-[#A1A1AA]"}`}
                >
                  {provider === opt.id && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#87BE00]" />
                  )}
                </div>
                <Text
                  size="sm"
                  className={`pt-[1px] font-medium tracking-wide flex-shrink-0 ${provider === opt.id ? "text-[#87BE00]" : "text-[#A1A1AA]"}`}
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
