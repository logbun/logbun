'use client';

import { Viewport } from '@logbun/ui';
import Footer from '../components/footer';
import Header from '../components/header';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <Viewport>
      <Header />
      {children}
      <Footer />
    </Viewport>
  );
}
