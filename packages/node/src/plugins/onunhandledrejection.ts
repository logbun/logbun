import { Client, Utils } from '@logbun/core';

let handler: NodeJS.UncaughtExceptionListener;

export default function () {
  return {
    load(client: Client) {
      handler = (error) => {
        const event = Utils.createEvent(error);

        client.broadcast(event);
      };

      process.on('unhandledRejection', handler);
    },
    destroy() {
      process.on('unhandledRejection', handler);
    },
  };
}
