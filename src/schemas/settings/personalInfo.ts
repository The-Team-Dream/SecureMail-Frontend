import z from "zod";

export const personalInfoSchema = z.object({
  username: z
    .string()
    .min(1, { message: "Full Name is required" })
    .min(3, { message: "Full Name must be at least 3 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email")
    .toLowerCase()
    .trim(),
});

export type IPersonalInfo = z.infer<typeof personalInfoSchema>;
