import z from "zod";

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email")
    .toLowerCase()
    .trim(),
});
export type IForgotPassword = z.infer<typeof forgotPasswordSchema>;
