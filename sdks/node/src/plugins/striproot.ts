import { Client, Types } from '@logbun/core';

export default function () {
  return {
    load(client: Client) {
      client.beforeNotify((event: Types.Event) => {
        event.stacktrace.forEach((stack) => {
          if (stack.fileName) {
            stack.fileName = stack.fileName
              .replace(process.cwd(), '[PROJECT_ROOT]')
              .replace(/.*\/node_modules\/(.+)/, '[NODE_MODULES]/$1');
          }
        });
        return event;
      });
    },
  };
}
