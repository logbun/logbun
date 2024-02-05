'use client';

import { Line } from '@logbun/app/types';
import { Code } from '@logbun/ui';

const languages: Record<string, string> = {
  js: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  tsx: 'tsx',
};

interface Props {
  lineNumber?: number;
  fileName?: string;
  preview: Line[];
}

export default function PreviewCode({ fileName = '', lineNumber, preview }: Props) {
  const extension = fileName.split('.').pop();

  const language = languages[extension || 'js'];

  return (
    <Code
      copyable={false}
      startingLineNumber={preview[0]?.[0]}
      showLineNumbers={true}
      language={language}
      highlight={lineNumber}
      wrapLongLines={false}
    >
      {/* eslint-disable-next-line no-unused-vars */}
      {preview.map(([_, source]) => source).join('\n')}
    </Code>
  );
}
