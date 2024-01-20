'use client';

import { EventStacktraceResult } from '@logbun/app/types';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as lightTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';

const languages: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
};

interface Props {
  frame: EventStacktraceResult;
}

export default function Preview({ frame }: Props) {
  const { lineNumber, fileName, preview } = frame;

  if (!preview?.length) {
    return (
      <p className="p-2 text-base leading-7 text-gray-600">
        <span className="text-xl">🤷🏻‍♂️</span> No additional context. You may need to upload your sourcemaps.
      </p>
    );
  }

  const extension = fileName?.split('.').pop();

  const language = languages[extension || 'js'];

  return (
    <SyntaxHighlighter
      style={lightTheme}
      wrapLines={true}
      startingLineNumber={preview[0]?.[0]}
      showLineNumbers={true}
      customStyle={{ background: 'none', fontSize: '0.8rem' }}
      language={language}
      lineProps={(line) => ({
        style: {
          display: 'block',
          backgroundColor: line === lineNumber ? '#e2e8f0' : undefined,
        },
      })}
    >
      {/* eslint-disable-next-line no-unused-vars */}
      {preview.map(([index, source]) => source).join('\n')}
    </SyntaxHighlighter>
  );
}
