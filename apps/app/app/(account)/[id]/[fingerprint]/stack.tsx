'use client';

import { EventLevel, EventStacktraceResult } from '@logbun/app/types';
import { Accordion } from '@logbun/ui';
import Line from './line';
import PreviewCode from './preview';

interface Props {
  level: EventLevel;
  frames: EventStacktraceResult[];
}

export default function Stack({ level, frames }: Props) {
  return (
    <Accordion type="single" collapsible defaultValue="0">
      {frames.map((frame, i) => {
        const { fileName, functionName, lineNumber, preview = [] } = frame;

        const key = `${fileName}${functionName}${lineNumber}`;

        return (
          <Accordion.Item key={key} value={`${i}`}>
            <Accordion.Trigger>
              <Line frame={frame} level={level} />
            </Accordion.Trigger>
            <Accordion.Content>
              {!preview.length ? (
                <p className="p-2 text-base leading-7 text-gray-600">
                  <span className="text-xl">🤷🏻‍♂️</span> No additional context. You may need to upload your sourcemaps to
                  Logbun to be able to see stack traces.
                </p>
              ) : (
                <PreviewCode fileName={fileName} lineNumber={lineNumber} preview={preview} />
              )}
            </Accordion.Content>
          </Accordion.Item>
        );
      })}
    </Accordion>
  );
}
