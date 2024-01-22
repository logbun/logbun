'use client';

import { Viewport } from '@logbun/ui';

export default function Root({ children }: { children: React.ReactNode }): JSX.Element {
  return <Viewport>{children}</Viewport>;
}
