import { Client } from './client';
import { onError, onUnhandledRejection } from './listeners';
import { BrowserOptions } from './types';

type LogbunType = {
  client: Client | null;
};

const Logbun: LogbunType = {
  client: null,
};

export const init = (options: BrowserOptions | string) => {
  if (Logbun.client) {
    Logbun.client.logger.warn('Logbun.init() was called more than once. Ignoring.');
    return Logbun.client;
  }

  if (typeof options === 'string') options = { token: options };

  const defaultOptions: Omit<BrowserOptions, 'token'> = {
    debug: true,
  };

  Logbun.client = new Client({ ...defaultOptions, ...options });

  onError(Logbun.client);

  onUnhandledRejection(Logbun.client);

  Logbun.client.logger.debug('Loaded');

  return Logbun.client;
};
