'use client';

import { Viewport } from '@logbun/ui';
import Footer from './footer';
import Header from './header';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Viewport>
      <Header />
      {children}
      <Footer />
    </Viewport>
  );
}
