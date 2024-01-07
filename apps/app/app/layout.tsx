import '@logbun/tailwind-config/tailwind.css';
import { cn, siteConfig } from '@logbun/utils';
import type { Metadata } from 'next';
import Root from './root';

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
    <html lang="en" className="antialiased">
      <body className={cn('relative', { ['debug-screens']: process.env.NODE_ENV === 'development' })}>
        <Root>{children}</Root>
      </body>
    </html>
  );
}
