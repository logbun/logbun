import { Client } from '@logbun/core';
import { promises as fs } from 'fs';

const SURROUNDING_LINES = 3;

export default function () {
  return {
    load(client: Client) {
      client.beforeNotify(async (event) => {
        for (const stack of event.stacktrace) {
          const { fileName, lineNumber } = stack;

          if (fileName && typeof lineNumber === 'number') {
            const start = Math.max(lineNumber - SURROUNDING_LINES, 0);

            const end = lineNumber + SURROUNDING_LINES;

            try {
              const content = await fs.readFile(fileName, 'utf-8');

              const rows = content.split('\n');

              const lines = rows.map((line, index) => [index + 1, line]);

              const source = lines.splice(start, end);

              stack.source = JSON.stringify(source);
            } catch (error) {}
          }
        }

        return event;
      });
    },
  };
}
