import React from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { WizardStepProps } from "../../../../../schemas/CustomAccount";

export function StepImapSmtp({ register, errors, clearErrors }: WizardStepProps) {
  return (
    <div className="w-full flex flex-col items-center max-w-2xl mx-auto">
      <Text as="h2" size="4xl" font="normal" className="mb-2.5">
        IMAP/SMTP Config
      </Text>
      <Text color={"primary-500"} size="sm" font="normal" className="mb-10 text-center">
        Please add the below data to complete adding your account
      </Text>

      <div className="w-full flex flex-col gap-4 max-w-[720px] mx-auto">
        {/* Row 1: Email */}
        <Input
          label="Email Address"
          required
          placeholder="you@company.com"
          {...(register ? register("email", { onChange: () => clearErrors?.("email") }) : {})}
          error={errors?.email?.message}
        />

        {/* Row 2: App Password */}
        <Input
          label="App Password"
          required
          type="password"
          placeholder="Enter App Password"
          {...(register ? register("password", { onChange: () => clearErrors?.("password") }) : {})}
          error={errors?.password?.message}
        />

        {/* Row 2.5: Encryption */}
        <div className="flex flex-col">
          <label className="block text-sm text-primary-400 mb-1">
            Encryption <span className="text-error-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full h-12 px-4 border text-[14px] text-primary rounded-lg outline-none transition duration-500 appearance-none bg-card ${errors?.encryption ? "border-error-500" : "border-primary-100 focus:border-primary-400"}`}
              {...(register ? register("encryption", { onChange: () => clearErrors?.("encryption") }) : {})}
            >
              <option value="SSL/TLS">SSL/TLS</option>
              <option value="STARTTLS">STARTTLS</option>
              <option value="None">None</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-400">
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M2.5 4.5L6 8L9.5 4.5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
          {errors?.encryption && (
            <span className="text-error-500 text-sm mt-1">
              {errors.encryption.message}
            </span>
          )}
        </div>

        {/* Row 3: IMAP Divider */}
        <div className="flex items-center gap-4 mt-4">
          <div className="h-px bg-primary-100 flex-1" />
          <Text font="medium" size="xs" color="primary-400" className="uppercase tracking-wider">
            IMAP Settings
          </Text>
          <div className="h-px bg-primary-100 flex-1" />
        </div>

        {/* Row 4: IMAP Host + Port */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="IMAP Host"
            required
            placeholder="imap.company.com"
            {...(register ? register("imapHost", { onChange: () => clearErrors?.("imapHost") }) : {})}
            error={errors?.imapHost?.message}
          />
          <Input
            label="Port"
            required
            type="number"
            placeholder="993"
            {...(register ? register("imapPort", { onChange: () => clearErrors?.("imapPort") }) : {})}
            error={errors?.imapPort?.message}
          />
        </div>

        {/* Row 6: SMTP Divider */}
        <div className="flex items-center gap-4 mt-4">
          <div className="h-px bg-primary-100 flex-1" />
          <Text font="medium" size="xs" color="primary-400" className="uppercase tracking-wider">
            SMTP Settings
          </Text>
          <div className="h-px bg-primary-100 flex-1" />
        </div>

        {/* Row 7: SMTP Host + Port */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="SMTP Host"
            required
            placeholder="smtp.company.com"
            {...(register ? register("smtpHost", { onChange: () => clearErrors?.("smtpHost") }) : {})}
            error={errors?.smtpHost?.message}
          />
          <Input
            label="Port"
            required
            type="number"
            placeholder="465"
            {...(register ? register("smtpPort", { onChange: () => clearErrors?.("smtpPort") }) : {})}
            error={errors?.smtpPort?.message}
          />
        </div>

      </div>
    </div>
  );
}
