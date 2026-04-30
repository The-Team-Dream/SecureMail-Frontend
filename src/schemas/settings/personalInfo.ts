import z from "zod";

export const personalInfoSchema = z.object({
  fullName: z
    .string()
    .min(1, { message: "Full Name is required" })
    .min(3, { message: "Full Name must be at least 3 characters" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email("Invalid Email")
    .toLowerCase()
    .trim(),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .regex(/^\+?[0-9\s-]{10,20}$/, { message: "Invalid phone number format" }),
});

export type IPersonalInfo = z.infer<typeof personalInfoSchema>;
