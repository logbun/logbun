'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createUser } from '@logbun/app/actions/auth';
import { AuthFormTypes, authSchema } from '@logbun/app/utils/schema';
import { errorMessage } from '@logbun/utils';
import { signIn } from 'next-auth/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function RegisterForm() {
  const { handleSubmit, register } = useForm<AuthFormTypes>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit: SubmitHandler<AuthFormTypes> = async ({ email, password }) => {
    try {
      const { success, message } = await createUser({ email, password });

      if (!success) throw new Error(message);

      const response = await signIn('credentials', { email, password, callbackUrl: '/' });

      if (!response) throw new Error('Error logging in - No response');

      if (response.error) throw new Error(`Error logging in - ${response.error}`);

      toast.success('Registered!');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="email" type="email" {...register('email')} />
      <input placeholder="password" type="password" {...register('password')} />
      <button type="submit">Register</button>
    </form>
  );
}
