import { build, events, fetch } from '@logbun/clickhouse/queries';
import { db, eq, projects } from '@logbun/db';
import { EventTypeResult } from './schema';

export const getProjectByApiKey = async (apiKey: string) => {
  const [project] = await db.select({ id: projects.id }).from(projects).where(eq(projects.apiKey, apiKey));

  return project;
};

export const getEventByKey = async (key: string) => {
  const select = [...events, 'any(projectId) as projectId'];

  const query = build({ select, where: `key = '${key}'` });

  const [event] = await fetch<EventTypeResult[]>(query);

  return event;
};
