import crypto from 'crypto';

type Key = {
  projectId: string;
  release?: string;
  url: string;
};

export const generateHashKey = (key: string) => {
  return crypto.createHash('md5').update(key).digest('hex');
};

export const generateBucketKey = ({ projectId, release, url }: Key) => {
  return `${projectId}/${release || 'main'}/${generateHashKey(url)}.js.map`;
};
