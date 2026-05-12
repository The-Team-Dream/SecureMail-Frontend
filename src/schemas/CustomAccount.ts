import { z } from "zod";

export const stepProviderSchema = z.object({
  mailboxName: z.string().min(1, "Mailbox Name is required"),
  emailAddress: z.string().email().min(1, "Mailbox Email is required"),
});
// Step 1
export const stepIMAPSchema = z.object({
  imapHost: z.string().min(1, "IMAP Host is required"),
  imapPort: z
    .string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must be a number"),
  imapSecurity: z.string().min(1, "Security is required"),
  imapUsername: z
    .string()
    .min(1, { message: "Username is required" })
    .trim()
    .min(3, { message: "Username must be between 3 and 20 characters" })
    .max(20, { message: "Username must be between 3 and 20 characters" }),
  imapPassword: z
    .string()
    .min(1, { message: "Password is required" })
    .min(16, { message: "Password must be at least 16 characters" })
    .max(32, { message: "Password must not exceed 32 characters" }),
});
// Step 2
export const stepSMTPSchema = z.object({
  smtpHost: z.string().min(1, "SMTP Host is required"),
  smtpPort: z
    .string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must be a number"),
  smtpSecurity: z.string().min(1, "Security is required"),
  smtpUsername: z
    .string()
    .min(1, { message: "Username is required" })
    .trim()
    .min(3, { message: "Username must be between 3 and 20 characters" })
    .max(20, { message: "Username must be between 3 and 20 characters" }),
  smtpPassword: z
    .string()
    .min(1, { message: "Password is required" })
    .min(8, { message: "Password must be between 8 and 32 characters" })
    .max(32, { message: "Password must be between 8 and 32 characters" }),
});
// Step 3
export const stepAdvancedSchema = z.object({
  syncInterval: z.string().min(1, "Sync Interval is required"),
});
// Step 4
export const wizardSchema = z.object({
  ...stepProviderSchema.shape,
  ...stepIMAPSchema.shape,
  ...stepSMTPSchema.shape,
  ...stepAdvancedSchema.shape,
});

export type WizardFormData = z.infer<typeof wizardSchema>;

import {
  UseFormRegister,
  FieldErrors,
  UseFormClearErrors,
} from "react-hook-form";

export interface WizardStepProps {
  formData?: WizardFormData;
  handleChange?: (field: keyof WizardFormData, value: string) => void;
  register?: UseFormRegister<WizardFormData>;
  errors?: FieldErrors<WizardFormData>;
  clearErrors?: UseFormClearErrors<WizardFormData>;
  onPrev?: () => void;
}
