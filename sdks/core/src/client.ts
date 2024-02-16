import { Config, ErrorEvent, Event, Logger, SDK, Task, Transport } from './types';
import { createEvent, pWaterfall } from './utils';

type BeforeNotificationFunction = Task<Event, Event>;

type AfterNotificationFunction = Task<ErrorEvent, ErrorEvent>;
export abstract class Client {
  protected pluginsLoaded: boolean = false;

  protected sdk: SDK;

  public config: Config;

  public logger: Logger;

  protected metadata: Record<string, unknown>;

  public readonly transport: Transport;

  protected beforeNotifications: Array<BeforeNotificationFunction> = [];

  protected afterNotifications: Array<AfterNotificationFunction> = [];

  constructor(config: Config) {
    this.config = {
      endpoint: 'https://api.logbun.com/event',
      debug: false,
      logger: console,
      ...config,
    };

    this.logger = this.loadLogger();

    this.transport = config.transport;

    this.metadata = config.metadata || {};

    this.sdk = {
      name: '@logbun/core',
      url: 'https://github.com/logbun/logbun/tree/master/sdks/core',
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

  private runFunctions = <T>(functions: Iterable<Task<T, T>>, ...args: T[]) => {
    return pWaterfall(functions, [...args]);
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
    this.runFunctions(this.beforeNotifications, event)
      .then(() => {
        this.logger.info('beforeNotifications ran successfully');
      })
      .catch((error) => {
        this.logger.error('beforeNotifications failed', error);
      })
      .finally(() => {
        this.send({ level: 'error', handled: false, ...event }, config);
      });
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

    this.transport.send({ endpoint: options.endpoint, headers: { 'X-API-Key': options.apiKey } }, body).then(() => {
      this.runFunctions(this.afterNotifications, body).then(() => {
        this.logger.info('afterNotifications ran successfully');
      });
    });
  };

  public beforeNotify = (handler: BeforeNotificationFunction) => {
    this.beforeNotifications.push(handler);
  };

  public afterNotify = (handler: AfterNotificationFunction) => {
    this.afterNotifications.push(handler);
  };
}
