import Logbun, { VERSION } from '@logbun/js';
import { LogbunErrorBoundary } from './LogbunErrorBoundary';

Logbun.setSDK({
  name: '@logbun/js',
  url: 'https://github.com/logbun/logbun-js/tree/master/packages/react',
  version: VERSION,
});

export { Logbun, LogbunErrorBoundary };
