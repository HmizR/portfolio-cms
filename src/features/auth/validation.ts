import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .email("Enter a valid email address.")
  .max(254, "Email must be 254 characters or fewer.")
  .transform((value) => value.toLowerCase());

export const setupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters.")
      .max(100, "Name must be 100 characters or fewer."),
    email: emailSchema,
    password: z
      .string()
      .min(12, "Password must be at least 12 characters.")
      .max(128, "Password must be 128 characters or fewer."),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(1, "Enter your password.")
    .max(128, "Password must be 128 characters or fewer."),
});

export type SetupInput = z.infer<typeof setupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export interface AuthFormState {
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "password" | "confirmPassword", string[]>>;
  values?: {
    name?: string;
    email?: string;
  };
}
