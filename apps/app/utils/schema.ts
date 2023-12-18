import { z } from 'zod';

export const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(3),
});

export type AuthFormTypes = z.infer<typeof authSchema>;
