import { ClipboardCheck, ClipboardIcon } from 'lucide-react';
import { useState } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Prism as SyntaxHighlighter, SyntaxHighlighterProps } from 'react-syntax-highlighter';
import { prism as lightTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface Props extends SyntaxHighlighterProps {
  copyable?: boolean;
  highlight?: number | number[];
}

export const Code = (props: Props) => {
  const { children, copyable = true, highlight, customStyle, ...rest } = props;

  const [copied, setCopied] = useState(false);

  const code = Array.isArray(children) ? children.join('') : children;

  const marks = Array.isArray(highlight) ? highlight : [highlight];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <div className="relative bg-gray-100 rounded">
      {copyable && (
        <button className="absolute top-0 right-0 p-2 text-gray-500">
          <CopyToClipboard text={code} onCopy={handleCopy}>
            {copied ? <ClipboardCheck size={14} /> : <ClipboardIcon size={14} />}
          </CopyToClipboard>
        </button>
      )}
      <SyntaxHighlighter
        style={lightTheme}
        wrapLines={true}
        wrapLongLines={true}
        showLineNumbers={false}
        showInlineLineNumbers={false}
        customStyle={{ background: 'none', fontSize: '0.8rem', ...customStyle }}
        lineProps={(lineNumber) => ({
          style: {
            display: 'block',
            backgroundColor: marks.includes(lineNumber) ? '#e2e8f0' : undefined,
          },
        })}
        {...rest}
      >
        {code.replace(/^\n/, '').replace(/\n$/, '')}
      </SyntaxHighlighter>
    </div>
  );
};
