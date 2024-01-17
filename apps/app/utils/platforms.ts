import Javascript from '@logbun/app/assets/platforms/javascript.svg';
import { EventResponse } from '../types';
// import Next from '@logbun/app/assets/platforms/next.svg';
// import Node from '@logbun/app/assets/platforms/node.svg';
// import React from '@logbun/app/assets/platforms/react.svg';

export const platforms = [
  { key: 'js', name: 'Browser Javascript', icon: Javascript },
  // { key: 'nextjs', name: 'Next.JS', icon: Next },
  // { key: 'react', name: 'React', icon: React },
  // { key: 'node', name: 'Node.JS', icon: Node },
];

export const emojis = {
  fatal: { icon: '💀', bg: 'bg-gray-100' },
  error: { icon: '❌', bg: 'bg-red-100' },
  warning: { icon: '⚠️', bg: 'bg-yellow-100' },
  log: { icon: '📝', bg: 'bg-gray-100' },
  info: { icon: 'ℹ️', bg: 'bg-blue-100' },
  debug: { icon: '🔍', bg: 'bg-gray-100' },
} as const;

export const getLevelEmoji = (level: EventResponse['level']) => {
  return level ? emojis[level] : emojis.info;
};
