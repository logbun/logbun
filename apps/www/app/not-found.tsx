'use client';

import { Button } from '@logbun/ui';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
      <h4>404 – Not found</h4>
      <Button asChild size="small">
        <Link href="/">Home</Link>
      </Button>
    </div>
  );
}
