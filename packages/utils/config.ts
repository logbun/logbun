export const site = {
  title: 'Logbun',
  url: 'https://logbun.com',
  description: 'Simple, open-source, privacy-first JavaScript error tracking for SaaS founders who ship fast.',

  docs: 'https://www.notion.so/meekscreativelab/Logbun-Docs-a525cb5539c341abba551121edaec4c0?pvs=4',
  discord: 'https://discord.gg/nhVEnBbB',
  twitter: 'https://twitter.com/logbunhq',
  github: 'https://github.com/logbun/logbun',
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
