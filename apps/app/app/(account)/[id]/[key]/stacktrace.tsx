import { getSourcemaps } from '@logbun/app/actions';
import { EventResultResponse } from '@logbun/app/types';
import Collapsible from './collapsible';
import Line from './line';
import Preview from './preview';

interface Props {
  projectId: string;
  event: EventResultResponse;
}

export default async function Stacktrace({ projectId: id, event }: Props) {
  const { release, stacktrace, level } = event;

  const results = await getSourcemaps({ id, release, stacktrace });

  return (
    <>
      <dl className="px-5 pt-0 pb-3 space-y-3 bg-white divide-y rounded-lg shadow p-b shadow-gray-100 ring-1 ring-gray-200/50">
        {results.map((frame, i) => {
          return (
            <Collapsible
              defaultOpen={i === 0}
              key={`${frame.fileName}${frame.functionName}${frame.lineNumber}`}
              title={<Line frame={frame} level={level} />}
            >
              <Preview frame={frame} />
            </Collapsible>
          );
        })}
      </dl>
    </>
  );
}
