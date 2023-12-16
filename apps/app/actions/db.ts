'use server';

import { count, db, eq, sql } from '@logbun/db';
import { accounts, users } from '@logbun/db/schema';
import { errorMessage } from '@logbun/utils';
import crypto from 'crypto';

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

export const insertUser = async (email: string, password: string) => {
  try {
    const query = db
      .insert(users)
      .values({
        id: sql.placeholder('id'),
        email: sql.placeholder('email'),
        password: sql.placeholder('password'),
      })
      .prepare('insert_user');

    const id = crypto.randomUUID();

    await query.execute({ id, email, password });

    return id;
  } catch (error) {
    throw new Error(`Error in inserting user: ${errorMessage(error)}`);
  }
};

export const insertAccount = async (userId: string) => {
  try {
    const query = db
      .insert(accounts)
      .values({
        userId: sql.placeholder('userId'),
        type: sql.placeholder('type'),
        provider: sql.placeholder('provider'),
        providerAccountId: sql.placeholder('providerAccountId'),
      })
      .prepare('insert_user');

    await query.execute({ userId, providerAccountId: userId, type: 'credentials', provider: 'credentials' });
  } catch (error) {
    throw new Error(`Error in inserting user: ${errorMessage(error)}`);
  }
};
