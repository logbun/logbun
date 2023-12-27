import { Client } from './client';
import { Event } from './event';
import { createEvent } from './process';

export const onError = (client: Client) => {
  window.onerror = (message, url, line, column, error) => {
    if (line === 0 && typeof message === 'string' && /Script error\.?/.test(message)) {
      return client.logger.warn('Ignoring cross-domain or eval script error.');
    }

    let event: Event;

    if (error) {
      event = createEvent(error);
    } else {
      // Browsers without error argument or stacktrace
      const problem = new Error();
      problem.name = 'Error';
      problem.message = typeof message === 'string' ? message : 'An HTML onerror="" handler failed to execute';
      problem.stack = `at ${url}:${line}${column ? `:${column}` : ''}`;

      event = createEvent(problem);
    }

    client.sendEvent(event);
  };
};

export const onUnhandledRejection = (client: Client) => {
  window.addEventListener('unhandledrejection', (rejection) => {
    let error = rejection.reason;

    // Accessing properties on evt.detail can throw errors
    try {
      const problem = rejection as unknown as { detail: { reason: Error } };
      if (problem.detail && problem.detail.reason) {
        error = problem.detail.reason;
      }
    } catch (e) {}

    const event = createEvent(error);

    client.sendEvent(event);
  });
};
