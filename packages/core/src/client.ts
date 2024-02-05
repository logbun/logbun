import { Config, ErrorEvent, Event, Logger, SDK, Transport } from './types';
import { createEvent } from './utils';

export abstract class Client {
  protected pluginsLoaded: boolean = false;

  protected sdk: SDK;

  public config: Config;

  public logger: Logger;

  protected metadata: Record<string, unknown>;

  public readonly transport: Transport;

  protected beforeNotifications: Array<(event: Event) => void> = [];

  protected afterNotifications: Array<(event: ErrorEvent) => void> = [];

  constructor(config: Config) {
    this.config = {
      endpoint: 'https://api.logbun.com/events',
      debug: false,
      logger: console,
      ...config,
    };

    this.logger = this.loadLogger();

    this.transport = config.transport;

    this.metadata = config.metadata || {};

    this.sdk = {
      name: '@logbun/core',
      url: 'https://github.com/logbun/logbun/tree/master/packages/core',
      version: '__VERSION__',
    };
  }

  private loadLogger = () => {
    const log = (method: keyof Logger) => {
      return (...args: unknown[]) => {
        if (method === 'debug') {
          if (!this.config.debug) return;
          method = 'log';
        }

        args.unshift('[Logbun]');

        if (this.config.logger) {
          this.config.logger[method](...args);
        }
      };
    };

    return {
      log: log('log'),
      info: log('info'),
      debug: log('debug'),
      warn: log('warn'),
      error: log('error'),
    };
  };

  private loadPlugins = () => {
    if (this.pluginsLoaded) return this.config.plugins;

    this.config.plugins.forEach((plugin) => plugin.load(this));

    this.pluginsLoaded = true;
  };

  public init = (config: Partial<Config>) => {
    this.config = { ...this.config, ...config };

    if (!config.apiKey) {
      this.logger.info('Api key not provided, client will not send events.');
    }

    this.loadPlugins();

    return this;
  };

  public setSDK = (sdk: SDK) => {
    this.sdk = sdk;
  };

  public addMetadata = (key: string, value: unknown) => {
    this.metadata = { ...this.metadata, [key]: value };
  };

  public notify = (error: unknown, config: Partial<Config> = {}) => {
    const event = createEvent(error);

    this.broadcast({ level: 'info', handled: true, ...event }, config);
  };

  public broadcast = (event: Event, config: Partial<Config> = {}) => {
    console.log('Broadcast');

    this.beforeNotifications.forEach((fn) => fn(event));

    this.send({ level: 'error', handled: false, ...event }, config);
  };

  private send = (event: Event, config: Partial<Config> = {}) => {
    const options = { ...this.config, ...config };

    if (!options.endpoint) {
      return this.logger.error('No endpoint');
    }

    if (!this.transport) {
      return this.logger.warn('Transport disabled. Skipping');
    }

    if (!options.apiKey) {
      return this.logger.warn('Api key not provided, client will not send events.');
    }

    const metadata = event.metadata || {};

    const body: ErrorEvent = {
      timestamp: Math.floor(Date.now() / 1000),
      metadata: { ...this.metadata, ...metadata },
      release: this.config.release,
      sdk: this.sdk,
      ...event,
    };

    this.transport
      .send(
        {
          endpoint: options.endpoint,
          headers: { 'X-API-Key': options.apiKey },
        },
        body
      )
      .then(() => {
        this.afterNotifications.forEach((fn) => fn(body));
      });
  };

  public beforeNotify = (handler: (event: Event) => void) => {
    this.beforeNotifications.push(handler);
  };

  public afterNotify = (handler: (event: ErrorEvent) => void) => {
    this.afterNotifications.push(handler);
  };
}
