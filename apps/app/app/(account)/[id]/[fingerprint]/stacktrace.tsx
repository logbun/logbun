import { getSourcemaps } from '@logbun/app/actions';
import { EventResultResponse } from '@logbun/app/types';
import { Button, Collapsible } from '@logbun/ui';
import { PlusIcon } from 'lucide-react';
import Line from './line';
import PreviewCode from './preview';

interface Props {
  projectId: string;
  event: EventResultResponse;
}

export default async function Stacktrace({ projectId: id, event }: Props) {
  const { release, stacktrace, level } = event;

  const frames = await getSourcemaps({ id, release, stacktrace });

  return (
    <>
      <dl className="px-5 pt-0 pb-3 space-y-3 bg-white divide-y rounded-lg shadow p-b shadow-gray-100 ring-1 ring-gray-200/50">
        {frames.map((frame, i) => {
          const { fileName, functionName, lineNumber, preview = [] } = frame;

          return (
            <Collapsible
              key={`${fileName}${functionName}${lineNumber}`}
              defaultOpen={i === 0}
              className="w-full space-y-2"
            >
              <Collapsible.Trigger asChild>
                <Button variant="default" className="justify-between">
                  <Line frame={frame} level={level} />
                  <PlusIcon className="w-4 h-4" />
                </Button>
              </Collapsible.Trigger>
              <Collapsible.Content className="space-y-2">
                {preview.length > 0 ? (
                  <p className="p-2 text-base leading-7 text-gray-600">
                    <span className="text-xl">🤷🏻‍♂️</span> No additional context. You may need to upload your sourcemaps.
                  </p>
                ) : (
                  <PreviewCode fileName={fileName} lineNumber={lineNumber} preview={preview} />
                )}
              </Collapsible.Content>
            </Collapsible>
          );
        })}
      </dl>
    </>
  );
}
