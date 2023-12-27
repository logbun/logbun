import { Client, Utils } from '@logbun/core';

const { global } = Utils;

export default function (window = global()) {
  return {
    load(client: Client) {
      const prevOnUnhandledRejection = window.onunhandledrejection;

      function onunhandledrejection(this: Window, rejection: PromiseRejectionEvent) {
        let error = rejection.reason;

        // Accessing properties on evt.detail can throw errors
        try {
          const problem = rejection as unknown as { detail: { reason: Error } };
          if (problem.detail && problem.detail.reason) {
            error = problem.detail.reason;
          }
        } catch (e) {}

        const event = Utils.createEvent(error);

        client.postEvent(event);

        if (typeof prevOnUnhandledRejection === 'function') {
          prevOnUnhandledRejection.apply(this, arguments as unknown as [PromiseRejectionEvent]);
        }
      }

      window.onunhandledrejection = onunhandledrejection;
    },
  };
}
