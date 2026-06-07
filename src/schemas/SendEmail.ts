import z from "zod";

const baseSchema = z.object({
  from: z.string().min(1, "Sender is required"),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  bodyText: z.string().optional(),
  bodyHtml: z.string().optional(),
});

export const emailSchema = z.discriminatedUnion("mode", [
  // New Mode
  baseSchema.extend({
    mode: z.literal("new"),
    to: z
      .string()
      .min(1, "Recipient email is required")
      .email("Invalid recipient email address"),
    subject: z.string().min(1, "Subject is required"),
    bodyText: z.string().min(1, "Message content is required"),
  }),
  // Reply Mode
  baseSchema.extend({
    mode: z.literal("reply"),
    to: z.string().optional(),
    subject: z.string().optional(),
    bodyText: z.string().min(1, "Reply content is required"),
  }),
  // Forward Mode
  baseSchema.extend({
    mode: z.literal("forward"),
    to: z.string().min(1, "Recipient email is required"),
    subject: z.string().optional(),
    bodyText: z.string().optional(),
  }),
]);

export type EmailFormValues = z.infer<typeof emailSchema>;
