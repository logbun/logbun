export const site = {
  title: 'Logbun',
  url: 'https://logbun.com',
  tagline: 'Simple, 100% open-source, privacy-friendly Sentry.io alternative',
  description: 'Logbun is a simple, 100% open-source, privacy-friendly Sentry.io alternative built for founders.',
  docs: 'https://logbun.site/docs',
  discord: 'https://logbun.site/discord',
  twitter: 'https://logbun.site/twitter',
  github: 'https://logbun.site/github',
};

export const defaultMetadata = {
  title: {
    template: `%s | ${site.title}`,
    default: `${site.title} | ${site.tagline}`,
  },
  description: site.description,
  metadataBase: new URL(site.url),
};

export const twitter = {
  title: site.title,
  description: site.description,
  card: 'summary_large_image',
  images: [{ url: `${site.url}/og.jpg`, alt: defaultMetadata.title.default }],
};

export const openGraph = {
  title: site.title,
  description: site.description,
  type: 'website',
  images: [{ url: `${site.url}/og.jpg`, width: 1200, height: 628, alt: defaultMetadata.title.default }],
  siteName: site.title,
};
