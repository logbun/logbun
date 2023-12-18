'use server';

import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@logbun/db';
import { errorMessage } from '@logbun/utils';
import { genSalt, hash } from 'bcryptjs';
import { AuthFormTypes, authSchema } from '../utils/schema';
import { countUserByEmail, insertUser } from './db';

export async function createUser(body: AuthFormTypes) {
  try {
    const { email, password } = await authSchema.parseAsync(body);

    const count = await countUserByEmail(email);

    if (count > 0) throw new Error('Email already exists. Please try with another email.');

    const salt = await genSalt(10);

    const securePassword = await hash(password, salt);

    const userId = await insertUser(email, securePassword);

    const client = DrizzleAdapter(db);

    if (!client.linkAccount) throw new Error('Invalid client');

    await client.linkAccount({ userId, providerAccountId: userId, type: 'email', provider: 'credentials' });

    return { success: true, message: 'User created' };
  } catch (error) {
    return { success: false, message: `Error in creating user: ${errorMessage(error)}` };
  }
}
