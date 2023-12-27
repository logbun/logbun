import { Client } from './client';
import { onError, onUnhandledRejection } from './listeners';
import { BrowserOptions } from './types';

type LogbunType = {
  client: Client | null;
};

const Logbun: LogbunType = {
  client: null,
};

export const init = (options: BrowserOptions) => {
  if (Logbun.client) {
    Logbun.client.logger.warn('Logbun.init() was called more than once. Ignoring.');
    return Logbun.client;
  }

  const defaultOptions: Omit<BrowserOptions, 'token'> = {
    debug: true,
    // metadata: { sdk: { name: '', version: '', url: '' } },
    ...options,
  };

  Logbun.client = new Client(defaultOptions);

  onError(Logbun.client);

  onUnhandledRejection(Logbun.client);

  Logbun.client.logger.debug('Loaded');

  return Logbun.client;
};

export * from './client';
