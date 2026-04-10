import z from "zod";

// Reset Password Schema
export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, { message: "Password is required" })
      .min(8, { message: "Password must be between 8 and 32 characters" })
      .max(32, { message: "Password must be between 8 and 32 characters" })
      .regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)\S+$/, {
        message: "Password must contain uppercase, lowercase and number",
      }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match",
  });
export type IResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
