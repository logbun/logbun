'use client';

import { signOut } from 'next-auth/react';

export default function DashboardForm() {
  return (
    <>
      <p>App</p>
      <button onClick={() => signOut()}>Sign out</button>
    </>
  );
}
