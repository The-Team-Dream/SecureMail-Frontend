import React, { useState } from "react";
import { Text } from "@/_components/shared/Text";
import { Input } from "@/_components/shared/Input";
import { WizardStepProps } from "../../../../../schemas/CustomAccount";
import { Dialog as DialogPrimitive } from "radix-ui";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

export function StepImapSmtp({
  register,
  errors,
  clearErrors,
}: WizardStepProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <div className="w-full flex flex-col items-center max-w-2xl mx-auto">
      <Text as="h2" size="4xl" font="normal" className="mb-2.5">
        IMAP/SMTP Config
      </Text>
      <Text
        color={"primary-500"}
        size="sm"
        font="normal"
        className="mb-10 text-center"
      >
        Please add the below data to complete adding your account
      </Text>

      <div className="w-full flex flex-col gap-4 max-w-[720px] mx-auto">
        {/* Row 1: Email */}
        <Input
          label="Email Address"
          required
          placeholder="you@company.com"
          {...(register
            ? register("email", { onChange: () => clearErrors?.("email") })
            : {})}
          error={errors?.email?.message}
        />

        {/* Row 2: App Password */}
        <div className="flex flex-col gap-1">
          <Input
            label="App Password"
            required
            type="password"
            placeholder="Enter App Password"
            {...(register
              ? register("password", {
                  onChange: () => clearErrors?.("password"),
                })
              : {})}
            error={errors?.password?.message}
          />
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="text-xs text-primary hover:text-primary-500 self-start hover:underline cursor-pointer transition-colors"
          >
            How can I get App password?
          </button>
        </div>

        {/* Row 2.5: Encryption */}
        <div className="flex flex-col">
          <label className="block text-sm text-primary-400 mb-1">
            Encryption <span className="text-error-500 ml-1">*</span>
          </label>
          <div className="relative">
            <select
              className={`w-full h-12 px-4 border text-[14px] text-primary rounded-lg outline-none transition duration-500 appearance-none bg-transparent ${errors?.encryption ? "border-error-500" : "border-primary-100 focus:border-primary-400"}`}
              {...(register
                ? register("encryption", {
                    onChange: () => clearErrors?.("encryption"),
                  })
                : {})}
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
          <Text
            font="medium"
            size="xs"
            color="primary-400"
            className="uppercase tracking-wider"
          >
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
            {...(register
              ? register("imapHost", {
                  onChange: () => clearErrors?.("imapHost"),
                })
              : {})}
            error={errors?.imapHost?.message}
          />
          <Input
            label="Port"
            required
            type="number"
            placeholder="993"
            {...(register
              ? register("imapPort", {
                  onChange: () => clearErrors?.("imapPort"),
                })
              : {})}
            error={errors?.imapPort?.message}
          />
        </div>

        {/* Row 6: SMTP Divider */}
        <div className="flex items-center gap-4 mt-4">
          <div className="h-px bg-primary-100 flex-1" />
          <Text
            font="medium"
            size="xs"
            color="primary-400"
            className="uppercase tracking-wider"
          >
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
            {...(register
              ? register("smtpHost", {
                  onChange: () => clearErrors?.("smtpHost"),
                })
              : {})}
            error={errors?.smtpHost?.message}
          />
          <Input
            label="Port"
            required
            type="number"
            placeholder="465"
            {...(register
              ? register("smtpPort", {
                  onChange: () => clearErrors?.("smtpPort"),
                })
              : {})}
            error={errors?.smtpPort?.message}
          />
        </div>
      </div>

      <DialogPrimitive.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <AnimatePresence>
          {isModalOpen && (
            <DialogPrimitive.Portal forceMount>
              <DialogPrimitive.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 z-50 bg-background/40 backdrop-blur-sm"
                />
              </DialogPrimitive.Overlay>
              <DialogPrimitive.Content asChild>
                <div className="fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%] p-4 focus:outline-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className="relative overflow-hidden rounded-2xl bg-card p-6 shadow-2xl border border-primary-100/50"
                  >
                    <div className="flex flex-col gap-2">
                      <DialogPrimitive.Title className="text-lg font-semibold text-primary-950">
                        How to generate an App Password
                      </DialogPrimitive.Title>
                      <DialogPrimitive.Description className="text-sm text-primary-400 mt-2">
                        App passwords let you sign in to your email account from apps on
                        devices that don't support 2-Step Verification.
                      </DialogPrimitive.Description>
                    </div>
                    <div className="flex flex-col gap-4 py-4 text-sm text-primary max-h-[60vh] overflow-y-auto pr-1">
                      <div className="space-y-2">
                        <Text font="semiBold">For Gmail / Google Workspace:</Text>
                        <ol className="list-decimal pl-5 space-y-1 text-primary-600">
                          <li>
                            Go to your{" "}
                            <Link
                              href="https://myaccount.google.com/security"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-primary"
                            >
                              Google Account Settings
                            </Link>
                            .
                          </li>
                          <li>
                            Select <strong>Security</strong> on the left panel.
                          </li>
                          <li>
                            Under "How you sign in to Google", turn on{" "}
                            <strong>2-Step Verification</strong>.
                          </li>
                          <li>
                            Once enabled, go back to Security and select{" "}
                            <strong>App passwords</strong> (or search for it).
                          </li>
                          <li>Generate a password and paste it here.</li>
                        </ol>
                      </div>
                      <div className="space-y-2">
                        <Text font="semiBold">For Outlook / Microsoft 365:</Text>
                        <ol className="list-decimal pl-5 space-y-1 text-primary-600">
                          <li>
                            Go to your{" "}
                            <Link
                              href="https://account.microsoft.com/security"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-primary"
                            >
                              Microsoft Account Security page
                            </Link>
                            .
                          </li>
                          <li>
                            Select <strong>Advanced security options</strong>.
                          </li>
                          <li>
                            Ensure <strong>Two-step verification</strong> is turned on.
                          </li>
                          <li>
                            Under "App passwords", select{" "}
                            <strong>Create a new app password</strong>.
                          </li>
                        </ol>
                      </div>
                    </div>
                    <DialogPrimitive.Close asChild>
                      <button
                        className="absolute right-4 top-4 rounded-full p-1 text-primary-500 transition-colors hover:bg-primary-100 hover:text-primary-900 cursor-pointer"
                        aria-label="Close"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </DialogPrimitive.Close>
                  </motion.div>
                </div>
              </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
          )}
        </AnimatePresence>
      </DialogPrimitive.Root>
    </div>
  );
}
