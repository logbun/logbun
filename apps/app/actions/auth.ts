'use server';

import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { count, db, eq, users } from '@logbun/db';
import { ONE_HOUR, errorMessage } from '@logbun/utils';
import { genSalt, hash } from 'bcryptjs';
import crypto from 'crypto';
import { Adapter } from 'next-auth/adapters';
import { isDisposableEmail, sendEmail } from '../utils/email';
import { RegisterFormTypes, registerSchema } from '../utils/schema';

export const countUserByEmail = async (email: string) => {
  try {
    const [user] = await db
      .select({ value: count(users.email) })
      .from(users)
      .where(eq(users.email, email))
      .limit(1);

    return user ? user.value : 0;
  } catch (error) {
    throw new Error(`Error in counting users: ${errorMessage(error)}`);
  }
};

export const insertUser = async (name: string, email: string, password: string) => {
  try {
    const [user] = await db.insert(users).values({ id: crypto.randomUUID(), name, email, password }).returning();

    if (!user) throw new Error('Unable to create user');

    return user.id;
  } catch (error) {
    throw new Error(`Error in inserting user: ${errorMessage(error)}`);
  }
};

export const findUser = async (email: string) => {
  try {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) throw new Error('Unable to find user');

    return user;
  } catch (error) {
    throw new Error(`Error in finding user: ${errorMessage(error)}`);
  }
};

export async function verifyToken(email: string, token: string) {
  try {
    const client = DrizzleAdapter(db) as Required<Adapter>;

    const invite = await client.useVerificationToken({ identifier: email, token });

    const expired = invite ? invite.expires.valueOf() < Date.now() : undefined;

    const user = await client.getUserByEmail(email);

    if (!user) throw new Error('Invalid user');

    if (expired) {
      await createVerifyToken(user.email);

      throw new Error('Verification expired. We just sent another one. Please check email');
    }

    await client.updateUser({ id: user.id, emailVerified: new Date() });

    return { success: true, message: 'Token verified' };
  } catch (error) {
    return { success: false, message: errorMessage(error) };
  }
}

export async function createVerifyToken(email: string) {
  const client = DrizzleAdapter(db) as Required<Adapter>;

  const token = crypto.randomBytes(20).toString('hex');

  const expires = new Date(Date.now() + ONE_HOUR);

  const url = `${process.env.NEXT_PUBLIC_APP_URL}/verify/${token}?email=${email}`;

  await sendEmail({
    to: email,
    subject: 'Confirm your Logbun account',
    text: `Click here to confirm your Logbun account\n${url}\n\n`,
    html: `<body>
              <p>Click here to confirm your Logbun account</p>
              <p><a href="${url}">${url}</a></p>
            </body>`,
  });

  await client.createVerificationToken({ identifier: email, token, expires });
}

export async function createUser(body: RegisterFormTypes) {
  try {
    const { name, email, password } = await registerSchema.parseAsync(body);

    const disposable = await isDisposableEmail(email);

    if (disposable) throw new Error('Disposable emails are not allowed.');

    const count = await countUserByEmail(email);

    if (count > 0) throw new Error('Email already exists. Please try with another email.');

    const salt = await genSalt(10);

    const securePassword = await hash(password, salt);

    const userId = await insertUser(name, email, securePassword);

    const client = DrizzleAdapter(db);

    if (!client.linkAccount) throw new Error('Invalid client');

    await client.linkAccount({ userId, providerAccountId: userId, type: 'email', provider: 'credentials' });

    await createVerifyToken(email);

    return { success: true, message: 'User created' };
  } catch (error) {
    return { success: false, message: `Error in creating user: ${errorMessage(error)}` };
  }
}
