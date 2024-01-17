'use server';

import { build, events, fetch, update } from '@logbun/clickhouse/queries';
import { db, desc, eq, integrations, projects } from '@logbun/db';
import { errorMessage } from '@logbun/utils';
import { revalidatePath } from 'next/cache';
import { EventResultResponse } from '../types';
import { getCurrentUser } from '../utils/auth';
import { ProjectFormTypes, projectSchema } from '../utils/schema';

export const findProjects = async (userId: string) => {
  try {
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.userId, userId))
      .limit(20)
      .orderBy(desc(projects.updatedAt));

    return project;
  } catch (error) {
    throw new Error(`Error in finding projects: ${errorMessage(error)}`);
  }
};

export const findProject = async (id: string) => {
  try {
    const [project] = await db.select().from(projects).where(eq(projects.id, id)).limit(1);

    return project;
  } catch (error) {
    throw new Error(`Error in finding project: ${errorMessage(error)}`);
  }
};

export async function createProject(data: ProjectFormTypes) {
  try {
    const user = await getCurrentUser();

    if (!user) throw new Error('No session user');

    const { name, platform } = await projectSchema.parseAsync(data);

    const [integration] = await db.insert(integrations).values({}).returning({ id: integrations.id });

    if (!integration) throw new Error('Integration not found');

    const [project] = await db
      .insert(projects)
      .values({ name, platform, userId: user.id, integrationId: integration.id })
      .returning();

    if (!project) throw new Error('Project creation error');

    return { success: true, message: 'Project created', data: project.id };
  } catch (error) {
    return { success: false, message: errorMessage(error), data: undefined };
  }
}

export async function updateProject({ id, name }: { id: string; name: string }) {
  try {
    await db.update(projects).set({ name }).where(eq(projects.id, id));
    return { success: true, message: 'Project updated' };
  } catch (error) {
    return { success: false, message: errorMessage(error) };
  }
}

export async function deleteProject({ id }: { id: string }) {
  try {
    await db.delete(projects).where(eq(projects.id, id));
    return { success: true, message: 'Project deleted' };
  } catch (error) {
    return { success: false, message: errorMessage(error) };
  }
}

export const getEvents = async (projectId: string, { resolved }: { resolved: string | undefined }) => {
  const select = [...events, 'resolved'];

  const where = [`projectId = '${projectId}'`];

  if (resolved !== undefined) {
    where.push(`resolved = ${resolved}`);
  }

  try {
    const query = build({
      select,
      where: where.join(' and '),
      groupBy: 'key, resolved',
      orderBy: 'updatedAt desc',
    });

    const data = await fetch<EventResultResponse[]>(query);

    return { success: true, message: 'Events fetched', data };
  } catch (error) {
    return { success: false, message: errorMessage(error), data: undefined };
  }
};

export const getEventDetails = async (key: string) => {
  try {
    const select = [...events, 'any(projectId) as projectId', 'resolved'];

    const query = build({ select, where: `key = '${key}'`, groupBy: 'key, resolved' });

    const [data] = await fetch<EventResultResponse[]>(query);

    return { success: true, message: 'Event fetched', data };
  } catch (error) {
    return { success: false, message: errorMessage(error), data: undefined };
  }
};

export const toggleEventResolved = async (key: string) => {
  const { success, message, data } = await getEventDetails(key);

  if (!success || !data) throw new Error(message);

  console.log(`Database had resolve ${data.resolved} and now I am setting it to ${!data.resolved}`);

  await update(data, { resolved: !data.resolved });

  revalidatePath('/(account)/[id]/[key]', 'page');
};

// export const updateEventDetails = async (key: string, event: Partial<EventResponse>) => {
//   const query = `SELECT * FROM logbun.event WHERE key = '${key}'`;

//   const [data] = await getEvent<EventResultResponse[]>(query);

//   if (!data) throw Error('No data found');

//   console.log({ prev: data.resolved, cur: event.resolved });

//   await updateEvent([data, event]);
// };
