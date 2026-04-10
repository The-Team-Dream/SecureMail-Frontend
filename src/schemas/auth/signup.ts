import z from "zod";
// Sign Up Schema
export const signupSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required" }).trim(),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email("Invalid Email")
      .toLowerCase()
      .trim(),
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
    acceptTerms: z.literal(true, {
      message: "You must agree to Terms & Conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password confirmation must match password",
  });
export type ISignUp = z.infer<typeof signupSchema>;
