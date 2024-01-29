'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { deleteProject, updateProject } from '@logbun/app/actions';
import { Project } from '@logbun/app/types';
import { ProjectFormTypes, projectSchema } from '@logbun/app/utils/schema';
import { Box, Button, Form, Input } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface Props {
  project: Project;
}

export default function GeneralForm({ project }: Props) {
  let [isPending, startTransition] = useTransition();

  const router = useRouter();

  const form = useForm<ProjectFormTypes>({
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
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <Box className="shadow">
          <Box.Header className="text-left">Project Details</Box.Header>
          <Box.Content>
            <div className="max-w-md">
              <Form.Field name="name" control={form.control}>
                <Input label="Name" placeholder="Project name" />
              </Form.Field>
            </div>
            <div className="pt-4">
              <Button loading={isPending} type="submit">
                Save
              </Button>
            </div>
          </Box.Content>
        </Box>
        <Box className="shadow">
          <Box.Header className="text-left">Danger Zone</Box.Header>
          <Box.Content>
            <div className="max-w-md">
              <Button variant="danger" onClick={onDelete}>
                Delete project
              </Button>
            </div>
          </Box.Content>
        </Box>
      </form>
    </Form>
  );
}
