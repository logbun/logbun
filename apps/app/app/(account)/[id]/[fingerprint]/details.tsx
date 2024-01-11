'use client';

import { EventResultResponse } from '@logbun/app/types';

interface Props {
  event: EventResultResponse;
}

export default function Details({ event }: Props) {
  return (
    <>
      <div>{event.name}</div>
    </>
  );
}
