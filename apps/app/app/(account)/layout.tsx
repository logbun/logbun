import { denyAccess, getCurrentUser } from '@logbun/app/utils/auth';
import React from 'react';
import Nav from './nav';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await getCurrentUser();

  if (!user) return denyAccess();

  return (
    <>
      <Nav email={user.email!} />
      {children}
    </>
  );
}
