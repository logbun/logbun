'use client';

import { Clipboard } from 'lucide-react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as lightTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { toast } from 'sonner';
import { StepConfig } from './libraries';

interface Props {
  steps: StepConfig[];
}

export default function TrackingCode({ steps }: Props) {
  return (
    <div className="bg-white divide-y rounded-md">
      {steps.map(({ title, content }) => (
        <div className="p-6">
          <h6 className="pb-1">{title}</h6>
          <div className="space-y-4">
            {content.map(({ message, snippet }) => (
              <div>
                {message && <p className="text-gray-500">{message}</p>}
                {snippet && (
                  <div className="relative bg-gray-100 rounded-md">
                    <button className="absolute top-0 right-0 p-2 text-gray-500">
                      <CopyToClipboard
                        text={Array.isArray(snippet.children) ? snippet.children.join('') : snippet.children}
                        onCopy={() => toast.success('Copied')}
                      >
                        <Clipboard size={14} />
                      </CopyToClipboard>
                    </button>
                    <SyntaxHighlighter
                      style={lightTheme}
                      wrapLines={true}
                      wrapLongLines={true}
                      showLineNumbers={false}
                      showInlineLineNumbers={false}
                      {...snippet}
                      customStyle={{ background: 'none', fontSize: '0.8rem' }}
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
