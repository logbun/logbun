import '@logbun/tailwind-config/tailwind.css';
import { cn, defaultMetadata, openGraph, twitter } from '@logbun/utils';
import type { Metadata } from 'next';
import Root from './root';

export const metadata: Metadata = {
  ...defaultMetadata,
  openGraph: { ...openGraph },
  twitter: { ...twitter },
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className="antialiased">
      <body className={cn('relative', { ['debug-screens']: process.env.NODE_ENV === 'development' })}>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
