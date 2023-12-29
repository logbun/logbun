'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { createProject } from '@logbun/app/actions/project';
import Javascript from '@logbun/app/assets/platforms/javascript.svg';
import Next from '@logbun/app/assets/platforms/next.svg';
import Node from '@logbun/app/assets/platforms/node.svg';
import React from '@logbun/app/assets/platforms/react.svg';
import { ProjectFormTypes, projectSchema } from '@logbun/app/utils/schema';
import { Button, Select, TextInput, buttonVariants } from '@logbun/ui';
import { cn, errorMessage, find } from '@logbun/utils';
import { Check } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

const platforms = [
  { key: 'javascript', name: 'Browser Javascript', icon: Javascript },
  // { key: 'angular', name: 'Angular', icon: Angular },
  { key: 'next', name: 'Next.JS', icon: Next },
  { key: 'react', name: 'React', icon: React },
  // { key: 'svelte', name: 'Svelte', icon: Svelte },
  // { key: 'vue', name: 'Vue', icon: Vue },
  { key: 'node', name: 'Node.JS', icon: Node },
  // { key: 'express', name: 'Express', icon: Express },
];

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
    defaultValues: { platform: 'react' },
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
          const selected = find(platforms, ['key', value]);

          return (
            <Select
              label={<Select.Label>Platform</Select.Label>}
              button={
                <Select.Button>
                  <span className="flex items-center">
                    <Image src={selected?.icon} alt="icon" className="flex-shrink-0 w-6 h-6 rounded-md" />
                    <span className="block ml-2 truncate">{selected?.name}</span>
                  </span>
                </Select.Button>
              }
              value={value}
              onChange={onChange}
            >
              <Select.Options>
                {platforms.map((option) => (
                  <Select.Option value={option.key} key={option.key}>
                    {({ selected }: { selected: boolean }) => (
                      <>
                        <div className="flex items-center">
                          <Image src={option.icon} alt="logo" className="flex-shrink-0 w-6 h-6 rounded-md" />
                          <span className={cn(selected ? 'font-semibold' : 'font-medium', 'ml-3 block truncate')}>
                            {option.name}
                          </span>
                        </div>
                        {selected ? (
                          <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-800">
                            <Check className="w-4 h-4" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Select.Option>
                ))}
              </Select.Options>
            </Select>
          );
        }}
      />
      <div className="flex items-center justify-end pt-2 space-x-3">
        <Link href="/" className={buttonVariants({ variant: 'secondary' })}>
          Back
        </Link>
        <Button loading={isPending} type="submit">
          Create Project
        </Button>
      </div>
    </form>
  );
}
