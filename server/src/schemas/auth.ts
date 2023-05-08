import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z.string().min(1).max(18),
    lastName: z.string().min(1).max(18),
    email: z.string().email(),
    password: z.string().min(8),
    confirmPassword: z.string(),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "The passwords did not match",
      });
    }
  });

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
