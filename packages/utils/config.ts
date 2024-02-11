export const site = {
  title: 'Logbun',
  url: 'https://logbun.com',
  description: 'Simple, open-source, privacy-first Sentry.io alternative for SaaS founders who ship fast.',
  docs: 'https://logbun.site/docs',
  discord: 'https://logbun.site/discord',
  twitter: 'https://logbun.site/twitter',
  github: 'https://logbun.site/github',
};

export const defaultMetadata = {
  title: {
    template: `%s | ${site.title}`,
    default: `${site.title} | ${site.description}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
};

export const twitter = {
  title: site.title,
  description: site.description,
  card: 'summary_large_image',
  images: [{ url: `${site.url}/og.png`, alt: site.title }],
};

export const openGraph = {
  title: site.title,
  description: site.description,
  type: 'website',
  images: [{ url: `${site.url}/og.png`, alt: site.title }],
  siteName: site.title,
};
