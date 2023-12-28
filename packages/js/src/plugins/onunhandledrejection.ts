import { Client, Utils } from '@logbun/core';

export default function (win = window) {
  return {
    load(client: Client) {
      const prevOnUnhandledRejection = win.onunhandledrejection;

      function onunhandledrejection(this: WindowEventHandlers, rejection: PromiseRejectionEvent) {
        let error = rejection.reason;

        // Accessing properties on evt.detail can throw errors
        try {
          const problem = rejection as unknown as { detail: { reason: Error } };
          if (problem.detail && problem.detail.reason) {
            error = problem.detail.reason;
          }
        } catch (e) {}

        const event = Utils.createEvent(error);

        client.send(event);

        // TODO: Remove any. I think this breaks
        if (typeof prevOnUnhandledRejection === 'function') {
          prevOnUnhandledRejection.apply(this as any, arguments as unknown as [PromiseRejectionEvent]);
        }
      }

      win.onunhandledrejection = onunhandledrejection;
    },
  };
}
