import { EventResultResponse } from '@logbun/app/types';
import { clickhouseClient } from '@logbun/clickhouse';
import Events from './events';

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
    handled,
    COUNT(fingerprint) AS count,
    MIN(timestamp) AS createdAt,
    MAX(timestamp) AS updatedAt
FROM
    logbun.event
WHERE
    apiKey = '${apiKey}'
GROUP BY
    fingerprint, name, message, level, handled
ORDER BY updatedAt DESC`;

  const response = await client.query({ query, format: 'JSONEachRow' });

  const data = await response.json();

  return data as EventResultResponse[];
}

export default async function Page() {
  const events = await getEvents('YOUR_API_KEY');

  console.log(events);

  return (
    <div className="py-6 container-lg">
      {/* <List events={events} /> */}
      <Events events={events} />
    </div>
  );
}

// Error, Occurences, Last
