import z from "zod";

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    newPassword: z
      .string()
      .min(1, { message: "New password is required" })
      .min(8, { message: "New password must be between 8 and 32 characters" })
      .max(32, { message: "New password must be between 8 and 32 characters" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S+$/, {
        message: "New password must contain uppercase, lowercase and number",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match",
  });
export type IResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
