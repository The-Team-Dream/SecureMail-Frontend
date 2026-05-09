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
    to: z.string().email("Valid email is required"),
    subject: z.string().min(1, "Subject is required"),
  }),
  // Reply Mode
  baseSchema.extend({
    mode: z.literal("reply"),
    to: z.string().optional(),
    subject: z.string().optional(),
  }),
  // Forward Mode
  baseSchema.extend({
    mode: z.literal("forward"),
    to: z.string().email("Recipient email is required"),
    subject: z.string().optional(),
  }),
]);

export type EmailFormValues = z.infer<typeof emailSchema>;
