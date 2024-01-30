import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const registerSchema = loginSchema.extend({ name: z.string().min(2).max(100) });

export const projectSchema = z.object({
  name: z.string().min(1),
  platform: z.string().min(1),
});

export type LoginFormTypes = z.infer<typeof loginSchema>;

export type RegisterFormTypes = z.infer<typeof registerSchema>;

export type ProjectFormTypes = z.infer<typeof projectSchema>;
