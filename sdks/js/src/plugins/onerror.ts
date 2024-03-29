import { Client, Utils } from '@logbun/core';

export default function (win = Utils.getGlobal()) {
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

        let notice: Error | undefined = error;

        if (!notice) {
          const exception = new Error();
          exception.name = 'Error';
          exception.message = typeof message === 'string' ? message : 'An HTML onerror="" handler failed to execute';
          exception.stack = `at ${url}:${line}${column ? `:${column}` : ''}`;

          notice = exception;
        }

        const event = Utils.createEvent(notice);

        client.broadcast(event);

        if (typeof prevOnError === 'function') {
          prevOnError.apply(this, arguments as OnErrorEventHandlerNonNull['arguments']);
        }
      }

      win.onerror = onerror;
    },
  };
}
