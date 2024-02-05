import { build, events, fetch } from '@logbun/clickhouse/src/queries';
import { db, eq, projects } from '@logbun/db';
import crypto from 'crypto';

import { EventType, EventTypeResult } from './schema';

export const getProjectByApiKey = async (apiKey: string) => {
  return db.query.projects.findFirst({
    where: eq(projects.apiKey, apiKey),
    columns: { id: true },
  });
};

export const getEventByFingerprint = async (fingerprint: string) => {
  const select = [...events, 'any(projectId) as projectId'];

  const query = build({ select, where: `fingerprint = '${fingerprint}'` });

  const [event] = await fetch<EventTypeResult[]>(query);

  return event;
};

export const generateFingerprint = ({ name, stacktrace }: Pick<EventType, 'name' | 'stacktrace'>) => {
  const keys = stacktrace.reduce((acc, cur) => {
    let total = acc;

    if (cur.fileName) {
      total += cur.fileName.replace(/\/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, '').replace(/[a-f0-9]{40}/g, ''); // Remove SHA hashes from filenames and Remove dates from filenames;
    }

    if (cur.functionName) {
      total += cur.functionName.replace(/\b\d{2,}\b/g, ''); // Remove integers 2 characters or longer from method names
    }

    return total;
  }, '');

  const hex = `${keys}${name}`;

  return crypto.createHash('md5').update(hex).digest('hex');
};
