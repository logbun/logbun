'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { updateUser } from '@logbun/app/actions';
import { RegisterFormTypes, projectSchema } from '@logbun/app/utils/schema';
import { Box, Button, EmailInput, TextInput } from '@logbun/ui';
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

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProfileType>({
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
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Box className="shadow">
        <Box.Header className="text-left">Profile Details</Box.Header>
        <Box.Content>
          <div className="max-w-md space-y-3">
            <TextInput
              {...register('name', { required: true })}
              label="Full name"
              placeholder="Enter full name"
              error={!!errors.name?.message}
              helperText={errors.name?.message}
            />
            <EmailInput label="Email" placeholder="Enter email address" disabled value={user.email} />
          </div>
          <div className="pt-6">
            <Button loading={isPending} type="submit">
              Update
            </Button>
          </div>
        </Box.Content>
      </Box>
    </form>
  );
}
