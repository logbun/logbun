'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AuthFormTypes, authSchema } from '@logbun/app/utils/schema';
import { Button, EmailInput, PasswordInput } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LogInForm() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormTypes>({
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
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <EmailInput
        {...register('email', { required: true })}
        label="Email"
        placeholder="Enter email address"
        error={!!errors.email?.message}
        helperText={errors.email?.message}
      />
      <PasswordInput
        {...register('password', { required: true, minLength: 8 })}
        label="Password"
        placeholder="Enter password"
        error={!!errors.password?.message}
        helperText={errors.password?.message}
      />
      <div className="pt-2">
        <Button loading={isSubmitting} type="submit" className="w-full">
          Sign In
        </Button>
      </div>
    </form>
  );
}
