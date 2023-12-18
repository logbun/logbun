import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { db } from '@logbun/db';
import { compare } from 'bcryptjs';
import { getServerSession, type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { redirect } from 'next/navigation';
import { findUser } from '../actions/db';
import { authSchema } from './schema';

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === 'development',
  pages: {
    error: '/login',
    signIn: '/login',
    signOut: '/logout',
  },
  adapter: DrizzleAdapter(db),
  session: { strategy: 'jwt' },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const { email, password } = await authSchema.parseAsync(credentials);

        const user = await findUser(email);

        if (!user) throw new Error("User don't exists");

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
      user: { ...session.user, id: token.sub },
    }),
    jwt: async ({ token, user }) => {
      const result = await findUser(token.email!);

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

export const getSession = () => getServerSession(authOptions);

export const denyAccess = () => redirect('/login');
