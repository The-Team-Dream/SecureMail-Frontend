import { z } from "zod";

export const stepProviderSchema = z.object({
  mailboxName: z.string().min(1, "Mailbox Name is required"),
});

// Step 2 (Merged IMAP/SMTP)
export const stepImapSmtpSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  imapHost: z.string().min(1, "IMAP Host is required"),
  imapPort: z
    .string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must be a number"),
  encryption: z.string().min(1, "Encryption is required"),
  password: z
    .string()
    .min(1, { message: "App Password is required" })
    .min(16, { message: "App Password must be at least 16 characters" })
    .max(32, { message: "App Password must not exceed 32 characters" }),
  smtpHost: z.string().min(1, "SMTP Host is required"),
  smtpPort: z
    .string()
    .min(1, "Port is required")
    .regex(/^\d+$/, "Port must be a number"),
});

// Step 3
export const stepAdvancedSchema = z.object({
  syncInterval: z.string().min(1, "Sync Interval is required"),
});

// Merged Wizard Schema
export const wizardSchema = z.object({
  ...stepProviderSchema.shape,
  ...stepImapSmtpSchema.shape,
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

export const imapConfigSchema = z.object({
  host: z.string().min(1, "IMAP server host is required"),
  port: z.coerce.number().min(1).max(65535),
  email: z.string().min(1, "Email is required"),
  password: z.string().min(1, "Password is required"),
  secure: z.boolean().default(true),
  displayName: z.string().min(1, "Name is required"),
  smtpHost: z.string().optional(),
  smtpPort: z.coerce.number().min(1).max(65535).optional(),
});
