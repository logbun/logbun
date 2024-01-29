'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { LoginFormTypes, loginSchema } from '@logbun/app/utils/schema';
import { Button, Form, Input } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function LogInForm() {
  const router = useRouter();

  const params = useSearchParams();

  const form = useForm<LoginFormTypes>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (params.get('verified')) {
      toast.success('Email verified', { duration: 5000, position: 'top-right' });
    }
  }, []);

  const onSubmit: SubmitHandler<LoginFormTypes> = async ({ email, password }) => {
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
    <Form {...form}>
      <form className="space-y-3" onSubmit={form.handleSubmit(onSubmit)}>
        <Form.Field name="email" control={form.control}>
          <Input.Email label="Email" placeholder="Enter email address" />
        </Form.Field>
        <Form.Field name="password" control={form.control}>
          <Input.Password label="Password" placeholder="Enter password" />
        </Form.Field>
        <div className="pt-2">
          <Button loading={form.formState.isSubmitting} type="submit" className="w-full">
            Sign In
          </Button>
        </div>
      </form>
    </Form>
  );
}
