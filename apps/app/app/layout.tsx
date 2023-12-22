import '@logbun/tailwind-config/tailwind.css';
import { cn, siteConfig } from '@logbun/utils';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Root from './root';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const title = `${siteConfig.name} | ${siteConfig.tagline}`;

export const metadata: Metadata = {
  title: { default: title, template: `%s | ${siteConfig.name}` },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    url: siteConfig.url,
    title,
    description: siteConfig.description,
    images: [{ url: `${siteConfig.url}/preview_card.png`, width: 1200, height: 628, alt: title }],
    siteName: siteConfig.name,
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <html lang="en" className={cn(inter.variable, 'text-slate-900 font-medium')}>
      <body className={cn('relative', { ['debug-screens']: process.env.NODE_ENV === 'development' })}>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
