import { getContexts } from '@logbun/app/actions';
import { EventResultResponse } from '@logbun/app/types';
import Stack from './stack';

interface Props {
  projectId: string;
  event: EventResultResponse;
}

export default async function Stacktrace({ projectId, event }: Props) {
  const { release, stacktrace, level, sdk } = event;

  const frames = await getContexts({ projectId, release, stacktrace, sdk: sdk.name });

  return (
    <div className="px-5 bg-white divide-y rounded-lg shadow p-b shadow-gray-100 ring-1 ring-gray-200/50">
      <Stack level={level} frames={frames} />
    </div>
  );
}
