import { Client, Types, Utils } from '@logbun/core';
import onError from './plugins/onerror';
import onUnhandledRejection from './plugins/onunhandledrejection';
import BrowserTransport from './transport';

class Logbun extends Client {
  constructor(config: Types.Config) {
    super(config);

    this.setSDK({
      name: '@logbun/js',
      url: 'https://github.com/logbun/logbun/tree/master/sdks/js',
      version: '__VERSION__',
    });
  }

  createEvent(...args: unknown[]) {
    return Utils.createEvent(args);
  }
}

const instance = new Logbun({
  transport: new BrowserTransport(),
  plugins: [onError(), onUnhandledRejection()],
});

instance.beforeNotify((event: Types.Event) => {
  return { ...event, url: window.location.href };
});

export default instance;
