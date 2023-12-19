import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export const registerSchema = loginSchema.extend({ name: z.string().min(2).max(100) });

export type LoginFormTypes = z.infer<typeof loginSchema>;

export type RegisterFormTypes = z.infer<typeof registerSchema>;
