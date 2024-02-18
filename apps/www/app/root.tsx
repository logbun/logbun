'use client';

import { Viewport } from '@logbun/ui';
import NextPlausibleProvider from 'next-plausible';
import Footer from '../components/footer';
import Header from '../components/header';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <NextPlausibleProvider domain="logbun.com">
      <Viewport>
        <Header />
        {children}
        <Footer />
      </Viewport>
    </NextPlausibleProvider>
  );
}
