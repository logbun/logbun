'use client';

import { Button } from '@logbun/ui';
import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div>
      <h5>Something went wrong!</h5>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  );
}
