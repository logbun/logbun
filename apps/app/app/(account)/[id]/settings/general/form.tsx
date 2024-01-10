'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { deleteProject, updateProject } from '@logbun/app/actions';
import { Project } from '@logbun/app/types';
import { ProjectFormTypes, projectSchema } from '@logbun/app/utils/schema';
import { Button, Panel, PanelContent, PanelHeader, TextInput } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  project: Project;
}

export default function ProjectForm({ project }: Props) {
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ProjectFormTypes>({
    resolver: zodResolver(projectSchema.pick({ name: true })),
    defaultValues: { name: project.name },
  });

  const onSubmit: SubmitHandler<ProjectFormTypes> = async ({ name }) => {
    startTransition(async () => {
      try {
        const { success, message } = await updateProject({ id: project.id, name });

        if (!success) throw Error(message);

        toast.success(message);

        router.refresh();
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  };

  const onDelete = async () => {
    try {
      if (!confirm('Are you sure you want to permanently delete this project?')) {
        return null;
      }

      const { success, message } = await deleteProject({ id: project.id });

      if (!success) throw Error(message);

      toast.success(message);

      router.push('/projects');

      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <Panel className="shadow">
        <PanelHeader className="text-left">Project Details</PanelHeader>
        <PanelContent>
          <div className="max-w-md">
            <TextInput
              {...register('name', { required: true })}
              label="Name"
              placeholder="Project name"
              error={!!errors.name?.message}
              helperText={errors.name?.message}
            />
          </div>
          <div className="pt-4">
            <Button loading={isPending} type="submit">
              Save
            </Button>
          </div>
        </PanelContent>
      </Panel>
      <Panel className="shadow">
        <PanelHeader className="text-left">Danger Zone</PanelHeader>
        <PanelContent>
          <div className="max-w-md">
            <Button variant="danger" onClick={onDelete}>
              Delete project
            </Button>
          </div>
        </PanelContent>
      </Panel>
    </form>
  );
}
