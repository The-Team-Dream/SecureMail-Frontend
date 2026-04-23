import React from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { WizardStepProps } from "./WizardTypes";

export function StepSMTP({ register, errors }: WizardStepProps) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex flex-col items-center">
      <Text as="h2" size="4xl" font="normal" className="text-center mb-2.5 text-primary-900 tracking-tight">SMTP Config</Text>
      <Text size="sm" font="normal" className="text-primary-400 text-center mb-10 tracking-wide">Please add the below data to complete adding your account</Text>

      <div className="w-full flex flex-col gap-4 text-left max-w-lg mx-auto">
        {/* Row 1: SMTP Host + Port */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="SMTP Host"
            required
            placeholder="Smtp.Company.Com"
            className="w-full focus:placeholder:text-transparent"
            {...(register ? register("smtpHost") : {})}
            error={errors?.smtpHost?.message}
          />
          <Input
            label="Port"
            required
            placeholder="465"
            className="w-full focus:placeholder:text-transparent"
            {...(register ? register("smtpPort") : {})}
            error={errors?.smtpPort?.message}
          />
        </div>

        {/* Row 2: Security */}
        <div className="flex flex-col">
          <label className="block text-sm text-primary-400 mb-1">
            Security <span className="text-error-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full h-12 px-4 border text-[14px] text-primary-900 dark:text-primary-100 rounded-xl outline-none transition duration-500 appearance-none bg-card ${errors?.smtpSecurity ? 'border-error-500' : 'border-primary-100 focus:border-primary-400'}`}
              {...(register ? register("smtpSecurity") : {})}
            >
              <option value="SSL/TLS">SSL/TLS</option>
              <option value="STARTTLS">STARTTLS</option>
              <option value="None">None</option>
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary-400">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
          {errors?.smtpSecurity && (
            <span className="text-error-500 text-sm mt-1">{errors.smtpSecurity.message}</span>
          )}
        </div>

        {/* Row 3: Username */}
        <Input
          label="Username"
          placeholder="Enter Your Username"
          className="w-full focus:placeholder:text-transparent"
          {...(register ? register("smtpUsername") : {})}
          error={errors?.smtpUsername?.message}
        />

        {/* Row 4: App Password */}
        <Input
          label="App Password"
          type="password"
          placeholder="Enter Password"
          className="w-full focus:placeholder:text-transparent"
          {...(register ? register("smtpPassword") : {})}
          error={errors?.smtpPassword?.message}
        />
      </div>
    </div>
  );
}
