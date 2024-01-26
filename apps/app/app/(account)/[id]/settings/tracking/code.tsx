'use client';

import { Tab } from '@headlessui/react';
import { Code } from '@logbun/ui';
import { cn } from '@logbun/utils';
import { LibraryConfig, LibraryContent } from './libraries';

interface Props {
  steps: LibraryConfig[];
}

export default function TrackingCode({ steps }: Props) {
  const renderSnippet = ({ snippet }: LibraryContent) => {
    if (!snippet) return null;

    return <Code {...snippet}>{snippet.children}</Code>;
  };
  // const renderSnippet = ({ snippet }: LibraryContent) => (
  //   <div>
  //     {snippet && (
  //       <div className="relative bg-gray-100 rounded">
  //         <button className="absolute top-0 right-0 p-2 text-gray-500">
  //           <CopyToClipboard
  //             text={Array.isArray(snippet.children) ? snippet.children.join('') : snippet.children}
  //             onCopy={() => toast.success('Copied')}
  //           >
  //             <Clipboard size={14} />
  //           </CopyToClipboard>
  //         </button>
  //         <SyntaxHighlighter
  //           style={lightTheme}
  //           wrapLines={true}
  //           wrapLongLines={true}
  //           showLineNumbers={false}
  //           showInlineLineNumbers={false}
  //           customStyle={{ background: 'none', fontSize: '0.8rem' }}
  //           {...snippet}
  //         >
  //           {snippet.children}
  //         </SyntaxHighlighter>
  //       </div>
  //     )}
  //   </div>
  // );

  const renderContent = (content: LibraryContent | LibraryContent[]) => {
    if (Array.isArray(content)) {
      return (
        <Tab.Group>
          <div className="border-b border-gray-200">
            <Tab.List className="flex -mb-px space-x-3">
              {content.map((item) => (
                <Tab
                  key={item.title}
                  className={({ selected }) =>
                    cn(
                      'whitespace-nowrap border-b-2 py-1 px-1 text-sm font-medium focus:outline-none',
                      selected
                        ? 'border-gray-800 text-gray-900'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                    )
                  }
                >
                  {item.title}
                </Tab>
              ))}
            </Tab.List>
          </div>
          <Tab.Panels>
            {content.map((item) => (
              <Tab.Panel>{renderSnippet(item)}</Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      );
    }

    return renderSnippet(content);
  };

  return (
    <div className="bg-white divide-y rounded-md">
      {steps.map(({ title, message, content }, index) => {
        return (
          <div className="p-6">
            <h6>
              {index + 1}: {title}
            </h6>
            {message && <p className="pb-1 text-gray-500">{message}</p>}
            {content && <div className="space-y-4">{renderContent(content)}</div>}
          </div>
        );
      })}
    </div>
  );
}
