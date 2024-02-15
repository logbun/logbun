import { InsertValues } from '@clickhouse/client';
import { createClient } from './client';

type Command = {
  select?: string[];
  from?: string;
  where?: string;
  groupBy?: string;
  orderBy?: string;
  having?: string;
};

class ClickHouseQueryBuilder {
  protected commands: Command;
  private client: ReturnType<typeof createClient>;

  constructor(commands: Command) {
    this.client = createClient();
    this.commands = commands;
  }

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
    const { select, from, where, groupBy, orderBy, having } = this.commands;

    const command = [];

    if (select) command.push(`SELECT ${select.join(', ')}`);
    if (from) command.push(`FROM ${from}`);
    if (where) command.push(`WHERE ${where}`);
    if (groupBy) command.push(`GROUP BY ${groupBy}`);
    if (having) command.push(`HAVING ${having}`);
    if (orderBy) command.push(`ORDER BY ${orderBy}`);

    return command.join(' ');
  }

  public async run<T>(): Promise<T> {
    const query = this.build();
    const response = await this.client.query({ query, format: 'JSONEachRow' });
    const data = await response.json();
    return data as T;
  }

  public async insert(values: InsertValues<any, unknown>): Promise<void> {
    await this.client.insert({ table: 'logbun.event', values, format: 'JSONEachRow' });
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

export default ClickHouseQueryBuilder;
