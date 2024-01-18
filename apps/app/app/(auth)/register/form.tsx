'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createUser } from '@logbun/app/actions/auth';
import { RegisterFormTypes, registerSchema } from '@logbun/app/utils/schema';
import { Button, EmailInput, PasswordInput, TextInput } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function RegisterForm() {
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<RegisterFormTypes>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormTypes> = async ({ name, email, password }) => {
    startTransition(async () => {
      try {
        const { success, message } = await createUser({
          name,
          email,
          password,
        });

        if (!success) throw new Error(message);

        router.push(`/confirm/?email=${email}`);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
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
        <Button loading={isPending} type="submit" className="w-full">
          Sign Up
        </Button>
      </div>
    </form>
  );
}
