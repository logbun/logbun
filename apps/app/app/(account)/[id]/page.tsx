import { EventResponse } from '@logbun/app/types';
import { clickhouseClient } from '@logbun/clickhouse';
import List from './list';

export const relative = true;

export const metadata = {
  title: 'Issues',
};

const client = clickhouseClient();

async function getEvents(apiKey: string) {
  const query = `SELECT
    name,
    message,
    fingerprint,
    level,
    COUNT(fingerprint) AS count,
    MIN(timestamp) AS createdAt,
    MAX(timestamp) AS updatedAt
FROM
    logbun.event
WHERE
    apiKey = '${apiKey}'
GROUP BY
    fingerprint, name, message, level
ORDER BY updatedAt DESC`;

  const response = await client.query({ query, format: 'JSONEachRow' });

  const data = await response.json();

  return data as EventResponse[];
}

export default async function Page() {
  const events = await getEvents('YOUR_API_KEY');

  return (
    <div className="pt-12 container-sm">
      <h3>Issues</h3>
      <div className="w-full py-8">
        <List events={events} />
      </div>
    </div>
  );
}
