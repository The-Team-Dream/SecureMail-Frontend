import z from "zod";

// Sign in Schema
export const signinSchema = z.object({
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
});
export type ISignin = z.infer<typeof signinSchema>;
