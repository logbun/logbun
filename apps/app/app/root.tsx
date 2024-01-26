'use client';

import { Viewport } from '@logbun/ui';
import { SessionProvider } from 'next-auth/react';
import { Toaster } from 'sonner';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Viewport>
      <Toaster />
      <SessionProvider>{children}</SessionProvider>
    </Viewport>
  );
}
