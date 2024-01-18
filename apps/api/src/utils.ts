import { build, events, fetch } from '@logbun/clickhouse/queries';
import { db, eq, projects } from '@logbun/db';
import crypto from 'crypto';
import { EventType, EventTypeResult } from './schema';

export const getProjectByApiKey = async (apiKey: string) => {
  const [project] = await db.select({ id: projects.id }).from(projects).where(eq(projects.apiKey, apiKey));

  return project;
};

export const getEvents = async (projectId: string) => {
  const query = build({ select: ['projectId'], where: `projectId = '${projectId}'` });

  const events = await fetch<EventTypeResult[]>(query);

  return events;
};

export const getEventByKey = async (key: string) => {
  const select = [...events, 'any(projectId) as projectId'];

  const query = build({ select, where: `key = '${key}'` });

  const [event] = await fetch<EventTypeResult[]>(query);

  return event;
};

export const generateKey = (event: Pick<EventType, 'name' | 'message' | 'stacktrace'>, id: string) => {
  const { name, message, stacktrace } = event;

  const stack = stacktrace.reduce((acc, cur) => acc + cur.source, '');

  const hex = `${id}${name}${message}${stack}`;

  return crypto.createHash('md5').update(hex).digest('hex');
};
