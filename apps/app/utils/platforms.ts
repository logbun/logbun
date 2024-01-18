import Javascript from '@logbun/app/assets/platforms/javascript.svg';
import React from '@logbun/app/assets/platforms/react.svg';
// import Next from '@logbun/app/assets/platforms/next.svg';
// import Node from '@logbun/app/assets/platforms/node.svg';

export const platforms = [
  { key: 'js', name: 'Browser Javascript', icon: Javascript },
  { key: 'react', name: 'React', icon: React },
  // { key: 'nextjs', name: 'Next.JS', icon: Next },
  // { key: 'node', name: 'Node.JS', icon: Node },
];

export const emojis = {
  fatal: '💀',
  error: '❌',
  warning: '⚠️',
  log: '📝',
  info: 'ℹ️',
  debug: '🔍',
} as const;

export const getLevelEmoji = (level: keyof typeof emojis) => {
  const emoji = emojis[level] || emojis.info;

  return { level, emoji };
};
