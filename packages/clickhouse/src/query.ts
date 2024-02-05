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

class ClickHouseQueryBuilder {
  private commands: Command = {};

  public events = [
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

  public select(select: string[]): this {
    this.commands.select = select;
    return this;
  }

  public from(from: string): this {
    this.commands.from = from;
    return this;
  }

  public where(where: string): this {
    this.commands.where = where;
    return this;
  }

  public groupBy(groupBy: string): this {
    this.commands.groupBy = groupBy;
    return this;
  }

  public orderBy(orderBy: string): this {
    this.commands.orderBy = orderBy;
    return this;
  }

  public having(having: string): this {
    this.commands.having = having;
    return this;
  }

  public build(): string {
    const {
      select = ['*'],
      from = 'logbun.event',
      where,
      groupBy = 'fingerprint',
      orderBy,
      having = 'sum(sign) > 0',
    } = this.commands;

    const command = [];

    command.push(`SELECT ${select.join(', ')}`);
    command.push(`FROM ${from}`);
    if (where) command.push(`WHERE ${where}`);
    command.push(`GROUP BY ${groupBy}`);
    command.push(`HAVING ${having}`);
    if (orderBy) command.push(`ORDER BY ${orderBy}`);

    return command.join(' ');
  }

  public async run<T>(): Promise<T> {
    const query = this.build();
    const response = await client.query({ query, format: 'JSONEachRow' });
    const data = await response.json();
    return data as T;
  }

  protected async insert(values: InsertValues<any, unknown>): Promise<void> {
    await client.insert({ table: 'logbun.event', values, format: 'JSONEachRow' });
  }

  public async create(values: InsertValues<any, unknown>): Promise<void> {
    await this.insert([{ ...values, sign: 1 }]);
  }

  public async remove(values: InsertValues<any, unknown>): Promise<void> {
    await this.insert([{ ...values, sign: -1 }]);
  }

  public async update(prev: InsertValues<any, unknown>, cur: InsertValues<any, unknown>): Promise<void> {
    await this.insert([
      { ...prev, sign: -1 },
      { ...prev, ...cur, sign: 1 },
    ]);
  }
}

export const query = new ClickHouseQueryBuilder();
