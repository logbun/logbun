import { Client } from '@logbun/core';
import { promises as fs } from 'fs';

const trimCode = (content: string, line: number, maxLines = 5) => {
  const rows = content.split('\n');
  const lines = rows.map((line, index) => [index + 1, line]);
  return lines.slice(Math.max(line - maxLines, 0), line + maxLines);
};

export default function () {
  return {
    load(client: Client) {
      client.beforeNotify(async (event) => {
        for (const stack of event.stacktrace) {
          const { fileName, lineNumber } = stack;

          if (fileName && typeof lineNumber === 'number') {
            try {
              const content = await fs.readFile(fileName, 'utf-8');

              const source = trimCode(content, lineNumber);

              stack.source = JSON.stringify(source);
            } catch (error) {}
          }
        }

        return event;
      });
    },
  };
}
