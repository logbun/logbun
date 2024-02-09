import { Client } from '@logbun/core';
import { trimCode } from '@logbun/server-utils';
import { promises as fs } from 'fs';

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
