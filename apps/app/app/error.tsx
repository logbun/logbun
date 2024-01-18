'use client';

import { Button } from '@logbun/ui';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full space-y-4">
      <h4>Something went wrong!</h4>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
