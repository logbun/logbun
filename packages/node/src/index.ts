import { Client, Types } from '@logbun/core';
import unhandledRejection from './plugins/onunhandledrejection';
import uncaughtException from './plugins/uncaughtexception';
import NodeTransport from './transport';

class Logbun extends Client {
  constructor(config: Types.Config) {
    super(config);
  }
}

const instance = new Logbun({
  transport: new NodeTransport(),
  plugins: [uncaughtException(), unhandledRejection()],
});

instance.setSDK({
  name: '@logbun/node',
  url: 'https://github.com/logbun/logbun/tree/master/packages/core/packages/node',
  version: '__VERSION__',
});

export default instance;
