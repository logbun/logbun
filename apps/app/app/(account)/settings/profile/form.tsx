'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser } from '@logbun/app/actions';
import { RegisterFormTypes, projectSchema } from '@logbun/app/utils/schema';
import { Box, Button, Form, Input } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  user: {
    id: string;
    name: string;
    email: string;
  };
}

type ProfileType = Pick<RegisterFormTypes, 'name'>;

export default function ProfileForm({ user }: Props) {
  let [isPending, startTransition] = useTransition();

  const form = useForm<ProfileType>({
    resolver: zodResolver(projectSchema.pick({ name: true })),
    defaultValues: { name: user.name },
  });

  const onSubmit: SubmitHandler<ProfileType> = async ({ name }) => {
    startTransition(async () => {
      try {
        await updateUser({ id: user.id, name });

        toast.success('User updated');
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  };

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Box className="shadow">
          <Box.Header className="text-left">Profile Details</Box.Header>
          <Box.Content>
            <div className="max-w-md space-y-3">
              <Form.Field name="name" control={form.control}>
                <Input label="Full name" placeholder="Enter full name" />
              </Form.Field>
              <Input.Email label="Email" placeholder="Enter email address" disabled />
            </div>
            <div className="pt-6">
              <Button loading={isPending} type="submit">
                Update
              </Button>
            </div>
          </Box.Content>
        </Box>
      </form>
    </Form>
  );
}
