import { query } from '@logbun/clickhouse';
import { db, eq, projects } from '@logbun/db';
import { EventTypeResult } from './schema';

export const getProjectByApiKey = async (apiKey: string) => {
  return db.query.projects.findFirst({
    where: eq(projects.apiKey, apiKey),
    columns: { id: true },
  });
};

export const getEventByFingerprint = async (fingerprint: string) => {
  const [event] = await query
    .select([...query.events, 'any(projectId) as projectId'])
    .where(`fingerprint = '${fingerprint}'`)
    .run<EventTypeResult[]>();

  return event;
};
