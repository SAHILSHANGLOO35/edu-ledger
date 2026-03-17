import z, { email, object } from "zod";

export const SigninSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export const CreateUserSchema = z.object({
  email: z.string(),
  password: z.string(),
  phone: z.string(),
});

export const SendSchema = z.object({
  to: z.string(),
  amount: z.number(),
});
