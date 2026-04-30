import z from "zod";

export const emailSchema = z.object({
  from: z.string().email("Invalid sender email"),
  to: z.string().email("Valid email is required"),
  subject: z.string().min(1, "Subject is required"),
  cc: z.string().optional(),
  bcc: z.string().optional(),
  bodyText: z.string().optional(),
});

export type EmailFormValues = z.infer<typeof emailSchema>;
