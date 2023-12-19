'use client';

import { SessionProvider } from 'next-auth/react';
import ReactDiv100vh from 'react-div-100vh';
import { Toaster } from 'sonner';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <ReactDiv100vh>
      <Toaster />
      <SessionProvider>{children}</SessionProvider>
    </ReactDiv100vh>
  );
}
