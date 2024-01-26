import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db, eq, users } from '@logbun/db';
import { compare } from 'bcryptjs';
import { DefaultSession, User, getServerSession, type NextAuthOptions } from 'next-auth';
import { Adapter } from 'next-auth/adapters';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';
import { findUserByEmail } from '../actions';
import { loginSchema } from './schema';

declare module 'next-auth' {
  // eslint-disable-next-line no-unused-vars
  interface Session {
    user: {
      id: string;
    } & DefaultSession['user'];
  }
}

declare module 'next-auth/adapters' {
  // eslint-disable-next-line no-unused-vars
  interface AdapterUser extends User {
    password: string;
  }
}

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  pages: {
    error: '/login',
    signIn: '/login',
    signOut: '/logout',
  },
  adapter: DrizzleAdapter(db) as Adapter,
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = await loginSchema.parseAsync(credentials);

        // Not using findUserByEmail because it omits password
        const [user] = await db.select().from(users).where(eq(users.email, email));

        if (!user) throw new Error("User don't exists");

        if (!user.emailVerified) throw new Error('User email not verified.');

        const verifyPassword = await compare(password, user.password);

        if (!verifyPassword) throw new Error('Incorrect password');

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => ({
      ...session,
      user: { ...session.user, id: token.id },
    }),
    jwt: async ({ token, user }) => {
      const result = await findUserByEmail(token.email!);

      if (!result) return { ...token, id: user.id };

      return {
        id: result.id,
        name: result.name,
        email: result.email,
        image: result.image,
      };
    },
  },
};

export const client = DrizzleAdapter(db) as unknown as Required<Adapter>;

export const getSession = () => getServerSession(authOptions);

export const getCurrentUser = async () => {
  const session = await getSession();
  return session ? session.user : null;
};

export const denyAccess = () => redirect('/login');
