import { denyAccess, getSession } from '@logbun/app/utils/auth';
import React from 'react';
import Nav from './nav';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();

  if (!session || !session.user) return denyAccess();

  return (
    <>
      <Nav email={session.user.email!} />
      {children}
    </>
  );
}
