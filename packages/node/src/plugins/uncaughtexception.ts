import { Client, Utils } from '@logbun/core';

let handler: NodeJS.UncaughtExceptionListener;

export default function () {
  return {
    load(client: Client) {
      handler = (error) => {
        const event = Utils.createEvent(error);

        client.send(event);
      };

      process.on('uncaughtException', handler);
    },
    destroy() {
      process.on('uncaughtException', handler);
    },
  };
}
