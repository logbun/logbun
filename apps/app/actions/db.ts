'use server';

import { clickhouseClient } from '@logbun/clickhouse';
import { count, db, desc, eq, sql } from '@logbun/db';
import { integrations, projects, users } from '@logbun/db/schema';
import { errorMessage } from '@logbun/utils';
import crypto from 'crypto';
import { EventResultResponse } from '../types';

export const getEvents = async (apiKey: string) => {
  const client = clickhouseClient();

  const query = `SELECT
    any(name) as name,
    any(message) as message,
    any(level) as level,
    any(handled) as handled,
    any(id) as id,
    any(timestamp) AS datetime,
    fingerprint,
    COUNT(fingerprint) AS count,
    MIN(timestamp) AS createdAt,
    MAX(timestamp) AS updatedAt
FROM
    logbun.event
WHERE
    apiKey = '${apiKey}'
GROUP BY
    fingerprint
ORDER BY updatedAt DESC`;

  const response = await client.query({ query, format: 'JSONEachRow' });

  const data = await response.json();

  console.log(data);

  return data as EventResultResponse[];
};

export const countUserByEmail = async (email: string) => {
  try {
    const query = db
      .select({ value: count(users.email) })
      .from(users)
      .where(eq(users.email, sql.placeholder('email')))
      .prepare('count_user');

    const [user] = await query.execute({ email });

    return user ? user.value : 0;
  } catch (error) {
    throw new Error(`Error in counting users: ${errorMessage(error)}`);
  }
};

export const findUser = async (email: string) => {
  try {
    const query = db
      .select()
      .from(users)
      .where(eq(users.email, sql.placeholder('email')))
      .prepare('find_user');

    const [user] = await query.execute({ email });

    return user;
  } catch (error) {
    throw new Error(`Error in finding user: ${errorMessage(error)}`);
  }
};

export const insertUser = async (name: string, email: string, password: string) => {
  try {
    const query = db
      .insert(users)
      .values({
        id: sql.placeholder('id'),
        name: sql.placeholder('name'),
        email: sql.placeholder('email'),
        password: sql.placeholder('password'),
      })
      .prepare('insert_user');

    const id = crypto.randomUUID();

    await query.execute({ id, name, email, password });

    return id;
  } catch (error) {
    throw new Error(`Error in inserting user: ${errorMessage(error)}`);
  }
};

export const findProject = async (id: string) => {
  try {
    const query = db
      .select()
      .from(projects)
      .where(eq(projects.id, sql.placeholder('id')))
      .limit(1)
      .prepare('find_project');

    const [project] = await query.execute({ id });

    return project;
  } catch (error) {
    throw new Error(`Error in finding project: ${errorMessage(error)}`);
  }
};

export const findFirstProject = async (userId: string) => {
  try {
    const query = db
      .select()
      .from(projects)
      .where(eq(projects.userId, sql.placeholder('userId')))
      .limit(1)
      .prepare('find_first_project');

    const [project] = await query.execute({ userId });

    return project;
  } catch (error) {
    throw new Error(`Error in finding project: ${errorMessage(error)}`);
  }
};

export const findProjects = async (userId: string) => {
  try {
    const query = db
      .select()
      .from(projects)
      .where(eq(projects.userId, sql.placeholder('userId')))
      .limit(20)
      .orderBy(desc(projects.updatedAt))
      .prepare('find_projects');

    const project = await query.execute({ userId });

    return project;
  } catch (error) {
    throw new Error(`Error in finding projects: ${errorMessage(error)}`);
  }
};

export const insertProject = async (name: string, platform: string, userId: string) => {
  try {
    const [integration] = await db.insert(integrations).values({}).returning();

    if (!integration) throw new Error('Integration not found');

    const query = db
      .insert(projects)
      .values({
        name: sql.placeholder('name'),
        platform: sql.placeholder('platform'),
        userId: sql.placeholder('userId'),
        integrationId: sql.placeholder('integrationId'),
      })
      .returning()
      .prepare('insert_project');

    const [project] = await query.execute({ userId, name, platform, integrationId: integration.id });

    return project;
  } catch (error) {
    throw new Error(`Error in inserting user: ${errorMessage(error)}`);
  }
};
