'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createUser } from '@logbun/app/actions/auth';
import { RegisterFormTypes, registerSchema } from '@logbun/app/utils/schema';
import { Button, Form, Input } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function RegisterForm() {
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<RegisterFormTypes>({
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
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <Form.Field name="name" control={form.control}>
          <Input label="Full name" placeholder="Enter full name" />
        </Form.Field>
        <Form.Field name="email" control={form.control}>
          <Input.Email label="Email" placeholder="Enter email address" />
        </Form.Field>
        <Form.Field name="password" control={form.control}>
          <Input.Password label="Password" placeholder="Enter password" />
        </Form.Field>
        <div className="pt-2">
          <Button loading={isPending} type="submit" className="w-full">
            Sign Up
          </Button>
        </div>
      </form>
    </Form>
  );
}
