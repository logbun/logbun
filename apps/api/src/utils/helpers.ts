import crypto from 'crypto';

import { EventType } from './schema';

export const generateFingerprint = (event: Pick<EventType, 'name' | 'stacktrace'>) => {
  const { name, stacktrace } = event;

  const keys = stacktrace.reduce((acc, cur) => {
    if (cur.fileName) {
      // Remove SHA hashes from filenames and Remove dates from filenames;
      acc += cur.fileName.replace(/\/[0-9]{4}-[0-9]{2}-[0-9]{2}/g, '').replace(/[a-f0-9]{40}/g, '');
    }

    if (cur.functionName) {
      // Remove integers 2 characters or longer from method names
      acc += cur.functionName.replace(/\b\d{2,}\b/g, '');
    }

    return acc;
  }, '');

  return crypto.createHash('md5').update(`${keys}${name}`).digest('hex');
};
