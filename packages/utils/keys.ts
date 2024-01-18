type Key = {
  id: string;
  release?: string;
  extension: string;
};

type KeyResult = Omit<Key, 'extension'>;

const generateKey = ({ id, release, extension }: Key) => {
  const filename = btoa(`${id}${release ? `-${release}` : ''}`);
  return `${filename}${extension}`;
};

export const generateMinifiedKey = (options: KeyResult) => {
  return generateKey({ ...options, extension: '.js' });
};

export const generateSourceMapKey = (options: KeyResult) => {
  return generateKey({ ...options, extension: '.map.js' });
};
