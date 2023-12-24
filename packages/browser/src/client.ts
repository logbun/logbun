import { Api } from './api';
import { Event } from './event';
import { BrowserOptions, ErrorEvent, LoggerOptions } from './types';

const noop = () => {};

export class Client {
  public logger: LoggerOptions;

  public api: Api;

  public options: BrowserOptions;

  constructor(options: BrowserOptions) {
    this.logger = { debug: noop, info: noop, warn: noop, error: noop };

    if (!options.token) throw new Error('No Logbun token set');

    if (options.debug) {
      this.enableLogger();
    }

    this.api = new Api(options);

    this.options = options;
  }

  private enableLogger() {
    const options = Object.keys(this.logger) as Array<keyof typeof this.logger>;

    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
      options.forEach((method) => {
        const logger = console[method];
        if (typeof logger === 'function') {
          this.logger[method] = logger.bind(console, '[Logbun]');
        } else {
          this.logger[method] = console.log.bind(console, '[Logbun]');
        }
      });
    }
  }

  public prepareEvent(event: Event) {
    const data = event.toJSON();

    const prepared: ErrorEvent = {
      timestamp: Math.floor(Date.now() / 1000),
      host: window.location.origin,
      ...data,
    };

    this.api.postEvent(prepared);
  }
}
