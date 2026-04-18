import z from "zod";

export const securitySchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(1, { message: "New Password is required" })
      .min(8, { message: "New Password must be between 8 and 32 characters" })
      .max(32, { message: "New Password must be between 8 and 32 characters" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S+$/, {
        message: "New Password must contain uppercase, lowercase and number",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ISecurity = z.infer<typeof securitySchema>;
