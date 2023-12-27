import { Client, Types } from '@logbun/core';
import onError from './plugins/onerror';
import onUnhandledRejection from './plugins/onunhandledrejection';
import BrowserTransport from './transport';

class Logbun extends Client {
  constructor(config: Types.Config) {
    super(config);
  }
}

const instance = new Logbun({
  transport: new BrowserTransport(),
  plugins: [onError(), onUnhandledRejection()],
});

instance.setSDK({
  name: '@logbun/js',
  url: 'https://github.com/logbun/logbun-js/tree/master/packages/core/packages/js',
  version: '__VERSION__',
});

export default instance;
