import { EventLevel, EventStacktrace } from '@logbun/app/types';
import { getLevelEmoji } from '@logbun/app/utils';

interface Props {
  frame: EventStacktrace;
  level: EventLevel;
}

const truncateFileName = (fileName: string, numberOfLevelsToGoUp = 5) => {
  const tokens = fileName.split('/');

  const useRelativePath = tokens.length > 1 + numberOfLevelsToGoUp;

  if (!useRelativePath) return fileName;

  return `.../${tokens.splice(tokens.length - numberOfLevelsToGoUp).join('/')}`;
};

const removeWebpack = (fileName: string) => fileName.replace(/^webpack:\/\/?_N_E\/(?:\.\/)?/, '');

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
    header.push(<span key={key}> {truncateFileName(removeWebpack(frame.fileName))}</span>); // TODO: User should specify this
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

  return <span>{header}</span>;
}
