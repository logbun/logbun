import { client } from './clickhouse';

export const getEvents = async (apiKey: string) => {
  const query = `select * from logbun.event apiKey = '${apiKey}'`;

  const response = await client.query({ query, format: 'JSONEachRow' });

  const data = (await response.json()) as any[];

  return data;
};
