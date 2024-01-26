import { EventLevel, EventStacktrace } from '@logbun/app/types';
import { getLevelEmoji } from '@logbun/app/utils';

interface Props {
  frame: EventStacktrace;
  level: EventLevel;
}

export default function Line({ frame, level }: Props) {
  const key = `${frame.fileName}${frame.functionName}${frame.lineNumber}`;

  const header: JSX.Element[] = [];

  if (frame.fileName) {
    header.push(
      <span key={key} className="text-sm">
        {getLevelEmoji(level).emoji}
        {'  '}
      </span>
    );
    header.push(<span key={key}> {frame.fileName}</span>);
  }

  if (frame.functionName) {
    header.push(
      <span key={key} className="text-gray-500">
        {' '}
        in{' '}
      </span>
    );
    header.push(<span key={key}>{frame.functionName}</span>);
  }

  if (frame.lineNumber) {
    header.push(
      <span key={key} className="text-gray-500">
        {' '}
        at line{' '}
      </span>
    );
    header.push(<span key={key}>{frame.lineNumber}</span>);
  }

  if (frame.columnNumber) {
    header.push(
      <span key={key} className="text-gray-500">
        :
      </span>
    );
    header.push(<span key={key}>{frame.columnNumber}</span>);
  }

  return header;
}
