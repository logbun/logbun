import { Client, Types } from '@logbun/core';
import unhandledRejection from './plugins/onunhandledrejection';
import stripRoot from './plugins/striproot';
import surroundingCode from './plugins/surroundingcode';
import uncaughtException from './plugins/uncaughtexception';
import NodeTransport from './transport';

class Logbun extends Client {
  constructor(config: Types.Config) {
    super(config);

    this.setSDK({
      name: '@logbun/node',
      url: 'https://github.com/logbun/logbun/tree/master/sdks/node',
      version: '__VERSION__',
    });
  }
}

const instance = new Logbun({
  transport: new NodeTransport(),
  plugins: [uncaughtException(), unhandledRejection(), surroundingCode(), stripRoot()],
});

export default instance;
