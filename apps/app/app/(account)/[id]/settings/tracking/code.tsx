'use client';

import { Code, Tabs } from '@logbun/ui';
import { LibraryConfig, LibraryContent } from './libraries';

interface Props {
  steps: LibraryConfig[];
}

export default function TrackingCode({ steps }: Props) {
  const renderSnippet = ({ snippet }: LibraryContent) => {
    if (!snippet) return null;
    return <Code {...snippet}>{snippet.children}</Code>;
  };

  const renderContent = (content: LibraryContent | LibraryContent[]) => {
    if (Array.isArray(content)) {
      return (
        <Tabs defaultValue={content.at(0)?.title}>
          <Tabs.List>
            {content.map((item) => (
              <Tabs.Trigger key={item.title} value={item.title!}>
                {item.title}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          {content.map((item) => (
            <Tabs.Content className="w-full" value={item.title!}>
              {renderSnippet(item)}
            </Tabs.Content>
          ))}
        </Tabs>
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
