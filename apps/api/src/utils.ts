import crypto from 'crypto';
import { EventType } from './schema';

export const generateKey = (event: EventType, id: string) => {
  const { name, message, stacktrace } = event;

  const stack = stacktrace.reduce((acc, cur) => acc + cur.source, '');

  const hex = `${id}${name}${message}${stack}`;

  return crypto.createHash('md5').update(hex).digest('hex');
};
