'use server';

import { errorMessage } from '@logbun/utils';
import { getSession } from '../utils/auth';
import { ProjectFormTypes, projectSchema } from '../utils/schema';
import { insertProject } from './db';

export async function createProject(body: ProjectFormTypes) {
  try {
    const session = await getSession();

    if (!session) throw new Error('No session');

    if (!session.user) throw new Error('No session user');

    const person = session.user as { id: string };

    const { name, platform } = await projectSchema.parseAsync(body);

    const project = await insertProject(name, platform, person.id);

    if (!project) throw new Error('Project creation error');

    return { success: true, message: 'Project created', data: project.id };
  } catch (error) {
    return { success: false, message: errorMessage(error), data: undefined };
  }
}
