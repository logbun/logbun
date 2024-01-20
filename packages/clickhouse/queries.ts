import { InsertValues } from '@clickhouse/client';
import { createClient } from './client';

const client = createClient();

type Command = {
  select?: string[];
  from?: string;
  where?: string;
  groupBy?: string;
  orderBy?: string;
  having?: string;
};

export const events = [
  'fingerprint',
  'any(id) as id',
  'any(name) as name',
  'any(message) as message',
  'any(level) as level',
  'any(handled) as handled',
  'any(release) as release',
  'any(metadata) as metadata',
  'any(stacktrace) as stacktrace',
  'any(sdk) as sdk',
  'any(os) as os',
  'any(osVersion) as osVersion',
  'any(browser) as browser',
  'any(browserVersion) as browserVersion',
  'any(device) as device',
  'toInt32(sum(count * sign)) as count',
  'toInt64(sum(createdAt * sign)) as createdAt',
  'toInt64(sum(updatedAt * sign)) as updatedAt',
];

export const build = (commands: Command) => {
  const {
    select = ['*'],
    from = 'logbun.event',
    where,
    groupBy = 'fingerprint',
    orderBy,
    having = 'sum(sign) > 0',
  } = commands;

  const command = [];

  command.push(`select ${select.join(', ')}`);
  command.push(`from ${from}`);
  if (where) command.push(`where ${where}`);
  command.push(`group by ${groupBy}`);
  command.push(`having ${having}`);
  if (orderBy) command.push(`order by ${orderBy}`);

  return command.join(' ');
};

export const fetch = async <T>(query: string): Promise<T> => {
  const response = await client.query({ query, format: 'JSONEachRow' });

  const data = await response.json();

  return data as T;
};

const insert = async (values: InsertValues<any, unknown>) => {
  await client.insert({ table: 'logbun.event', values, format: 'JSONEachRow' });
};

export const create = async (values: InsertValues<any, unknown>) => {
  await insert([{ ...values, sign: 1 }]);
};

export const remove = async (values: InsertValues<any, unknown>) => {
  await insert([{ ...values, sign: -1 }]);
};

export const update = async (prev: InsertValues<any, unknown>, cur: InsertValues<any, unknown>) => {
  insert([
    { ...prev, sign: -1 },
    { ...prev, ...cur, sign: 1 },
  ]);
};
