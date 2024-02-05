import crypto from 'crypto';

type Key = {
  projectId: string;
  release?: string;
  url: string;
};

export const generateHashKey = (key: string) => {
  return crypto.createHash('md5').update(key).digest('hex');
};

export const generateBucketKey = ({ projectId, release = 'main', url }: Key) => {
  const path = new URL(url);
  const newUrl = `${path.protocol}//${path.host}${path.pathname}`;
  return `${projectId}/${release}/${generateHashKey(newUrl)}.js.map`;
};
