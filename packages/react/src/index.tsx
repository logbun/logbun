import Logbun from '@logbun/js';
import LogbunErrorBoundary from './LogbunErrorBoundary';

Logbun.setSDK({
  name: '@logbun/react',
  url: 'https://github.com/logbun/logbun-js/tree/master/packages/react',
  version: '__VERSION__',
});

export { Logbun, LogbunErrorBoundary };
