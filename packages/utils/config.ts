export const site = {
  title: 'Logbun',
  url: 'https://logbun.com',
  tagline: 'Track errors without compromising user privacy.',
  description: 'Logbun is an easy to use, privacy-first,fully open-source error tracking platform',
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
