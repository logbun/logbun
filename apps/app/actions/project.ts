'use server';

import { clickhouseClient } from '@logbun/clickhouse';
import { db, eq, integrations, projects } from '@logbun/db';
import { errorMessage } from '@logbun/utils';
import { EventResultResponse } from '../types';
import { getCurrentUser } from '../utils/auth';
import { ProjectFormTypes, projectSchema } from '../utils/schema';

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

export const getEvents = async (apiKey: string) => {
  const client = clickhouseClient();

  const query = `SELECT
    fingerprint,
    any(name) as name,
    any(message) as message,
    any(level) as level,
    any(handled) as handled,
    any(id) as id,
    count(fingerprint) AS count,
    min(timestamp) AS createdAt,
    max(timestamp) AS updatedAt
  FROM
    logbun.event
  WHERE
    apiKey = '${apiKey}'
  GROUP BY
    fingerprint
  ORDER BY updatedAt DESC`;

  const response = await client.query({ query, format: 'JSONEachRow' });

  const data = await response.json();

  return data as EventResultResponse[];
};

export const getEventDetails = async (fingerprint: string) => {
  const client = clickhouseClient();

  const query = `SELECT
    any(id) as id,
    name,
    fingerprint,
    message,
    level,
    handled,
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    stacktrace,
    stack,
    count(fingerprint) AS count,
    min(timestamp) AS createdAt,
    max(timestamp) AS updatedAt
  FROM logbun.event
  WHERE
    fingerprint = '${fingerprint}'
  GROUP BY
    fingerprint,
    name,
    message,
    level,
    handled,
    browser,
    browserVersion,
    os,
    osVersion,
    device,
    stack,
    stacktrace`;

  const response = await client.query({ query, format: 'JSONEachRow' });

  const data = await response.json();

  const [event] = data as EventResultResponse[];

  return event;
};
