import crypto from 'crypto';
import { EventType } from './schema';

type FingerprintEvent = Pick<EventType, 'name' | 'stacktrace'>;

/* Remove integers 2 characters or longer from method names */
const removeSHA = (name?: string) => name?.replace(/\/[0-9]{4}-[0-9]{2}-[0-9]{2}|[a-f0-9]{40}/g, '');

/* Remove integers 2 characters or longer from method names */
const shortenName = (name?: string) => name?.replace(/\/[0-9]{4}-[0-9]{2}-[0-9]{2}|\b\d{2,}\b|[a-f0-9]{40}/g, '');

export const generateFingerprint = ({ name, stacktrace }: FingerprintEvent) => {
  const keys = stacktrace.reduce((acc, cur) => {
    if (cur.fileName) acc += removeSHA(cur.fileName);
    if (cur.functionName) acc += shortenName(cur.functionName);
    return acc;
  }, '');

  return crypto.createHash('md5').update(`${keys}${name}`).digest('hex');
};
