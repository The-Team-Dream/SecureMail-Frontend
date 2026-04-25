import { z } from "zod";

export const stepProviderSchema = z.object({
  mailboxName: z.string().min(1, "Mailbox Name is required"),
  emailAddress: z.string().optional(),
});

export const stepIMAPSchema = z.object({
  imapHost: z.string().min(1, "IMAP Host is required"),
  imapPort: z.string().min(1, "Port is required"),
  imapSecurity: z.string().min(1, "Security is required"),
  imapUsername: z.string().optional(),
  imapPassword: z.string().optional(),
});

export const stepSMTPSchema = z.object({
  smtpHost: z.string().min(1, "SMTP Host is required"),
  smtpPort: z.string().min(1, "Port is required"),
  smtpSecurity: z.string().min(1, "Security is required"),
  smtpUsername: z.string().optional(),
  smtpPassword: z.string().optional(),
});

export const stepAdvancedSchema = z.object({
  syncInterval: z.string().min(1, "Sync Interval is required"),
});

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
}
