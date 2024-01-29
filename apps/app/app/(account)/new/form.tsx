'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createProject } from '@logbun/app/actions';
import { platforms } from '@logbun/app/utils';
import { ProjectFormTypes, projectSchema } from '@logbun/app/utils/schema';
import { Button, Select, TextInput } from '@logbun/ui';
import { Label } from '@logbun/ui/src/label';
import { errorMessage } from '@logbun/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

export default function ProjectForm() {
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
  } = useForm<ProjectFormTypes>({
    resolver: zodResolver(projectSchema),
    defaultValues: { platform: platforms[0]?.key },
  });

  const onSubmit: SubmitHandler<ProjectFormTypes> = async ({ name, platform }) => {
    startTransition(async () => {
      try {
        const { success, message, data } = await createProject({ name, platform });

        if (!success) throw new Error(message);

        toast.success(message);

        router.push(`/${data}`);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        {...register('name', { required: true })}
        label="Name"
        placeholder="Project name"
        error={!!errors.name?.message}
        helperText={errors.name?.message}
      />
      <Controller
        control={control}
        name="platform"
        render={({ field: { onChange, value } }) => {
          return (
            <div>
              <Label>Platform</Label>
              <Select value={value} onValueChange={onChange}>
                <Select.Trigger className="w-full">
                  <Select.Value placeholder="Select Platform" />
                </Select.Trigger>
                <Select.Content>
                  {platforms.map((option) => (
                    <Select.Item value={option.key} key={option.key}>
                      <div className="flex items-center">
                        <Image src={option.icon} alt="logo" width={22} height={22} className="rounded" />
                        <span className="block ml-2 truncate">{option.name}</span>
                      </div>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>
          );
        }}
      />
      <div className="flex items-center justify-start pt-4 space-x-4">
        <Button asChild variant="secondary">
          <Link href="/">Back</Link>
        </Button>
        <Button loading={isPending} type="submit">
          Create Project
        </Button>
      </div>
    </form>
  );
}
