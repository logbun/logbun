import Javascript from '@logbun/ui/assets/platforms/javascript.svg';
import React from '@logbun/ui/assets/platforms/react.svg';
// import Next from '@logbun/ui/assets/platforms/next.svg';
// import Node from '@logbun/ui/assets/platforms/node.svg';

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
