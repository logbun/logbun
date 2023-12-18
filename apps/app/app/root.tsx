'use client';

import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <>
      <Toaster closeButton />
      <SessionProvider>{children}</SessionProvider>
    </>
  );
}
