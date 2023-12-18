'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormTypes, authSchema } from '@logbun/app/utils/schema';
import { errorMessage } from '@logbun/utils';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LogInForm() {
  const router = useRouter();

  const { handleSubmit, register } = useForm<AuthFormTypes>({
    resolver: zodResolver(authSchema),
  });

  const onSubmit: SubmitHandler<AuthFormTypes> = async ({ email, password }) => {
    try {
      const response = await signIn('credentials', { email, password, redirect: false });

      if (!response) throw new Error('Error logging in - No response');

      if (response.error) throw new Error(`Error logging in - ${response.error}`);

      toast.success('Success');

      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input placeholder="email" type="email" {...register('email')} />
      <input placeholder="password" type="password" {...register('password')} />
      <button type="submit">Sign In</button>
    </form>
  );
}
