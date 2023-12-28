import { Client, Types, Utils } from '@logbun/core';

export default function (win = window) {
  return {
    load(client: Client) {
      const prevOnError = win.onerror;

      function onerror(
        this: WindowEventHandlers,
        message: string | globalThis.Event,
        url?: string,
        line?: number,
        column?: number,
        error?: Error
      ) {
        if (line === 0 && typeof message === 'string' && /Script error\.?/.test(message)) {
          return client.logger.warn('Ignoring cross-domain or eval script error.');
        }

        let event: Types.Event;

        if (!error) {
          const exception = new Error();
          exception.name = 'Error';
          exception.message = typeof message === 'string' ? message : 'An HTML onerror="" handler failed to execute';
          exception.stack = `at ${url}:${line}${column ? `:${column}` : ''}`;

          event = Utils.createEvent(exception);
        } else {
          event = Utils.createEvent(error);
        }

        client.send(event);

        if (typeof prevOnError === 'function') {
          prevOnError.apply(this, arguments as OnErrorEventHandlerNonNull['arguments']);
        }
      }

      win.onerror = onerror;
    },
  };
}
