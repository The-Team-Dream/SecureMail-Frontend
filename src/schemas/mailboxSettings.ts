import { z } from "zod";

export const mailBoxSettingsSchema = z.object({
  mailboxName: z
    .string()
    .min(1, "Mailbox name is required")
    .max(50, "Mailbox name cannot exceed 50 characters"),
  pushNotifications: z.boolean(),
});

export type IMailboxSettings = z.infer<typeof mailBoxSettingsSchema>;
