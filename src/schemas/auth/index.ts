import z from "zod";
// Sign Up Schema
export const signupSchema = z
  .object({
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().min(1, { message: "Email is required" }),
    password: z.string().min(1, { message: "Password is required" }),
    terms: z.literal(true, {
      message: "You must agree to Terms & Conditions",
    }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match",
  });

// Sign in Schema
export const signinSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email"),
  password: z.string().min(1, { message: "Password is required" }),
});

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email"),
});

// Update Password Schema
export const updatePasswordSchema = z
  .object({
    password: z.string().min(1, { message: "Password is required" }),
    confirmPassword: z
      .string()
      .min(1, { message: "Confirm password is required" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password does not match",
  });

export type ISignUp = z.infer<typeof signupSchema>;
export type ISignin = z.infer<typeof signinSchema>;
export type IUpdatePassword = z.infer<typeof updatePasswordSchema>;
export type IForgotPassword = z.infer<typeof forgotPasswordSchema>;
