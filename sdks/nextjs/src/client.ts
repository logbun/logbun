import Logbun, { LogbunErrorBoundary } from '@logbun/react';

Logbun.setSDK({
  name: '@logbun/react',
  url: 'https://github.com/logbun/logbun/tree/master/sdks/react',
  version: '__VERSION__',
});

export { Logbun, LogbunErrorBoundary };
