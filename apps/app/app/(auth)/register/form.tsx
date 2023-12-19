'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createUser } from '@logbun/app/actions/auth';
import { RegisterFormTypes, registerSchema } from '@logbun/app/utils/schema';
import { Button, EmailInput, PasswordInput, TextInput } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function RegisterForm() {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormTypes>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormTypes> = async ({ name, email, password }) => {
    try {
      const { success, message } = await createUser({ name, email, password });

      if (!success) throw new Error(message);

      const response = await signIn('credentials', { email, password, redirect: false });

      if (!response) throw new Error('Error logging in - No response');

      if (response.error) throw new Error(`Error logging in - ${response.error}`);

      toast.success('Registered!');

      router.push('/new');
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        {...register('name', { required: true })}
        label="Full name"
        placeholder="Enter full name"
        error={!!errors.name?.message}
        helperText={errors.name?.message}
      />
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
          Sign Up
        </Button>
      </div>
    </form>
  );
}
