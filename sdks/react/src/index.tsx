import Logbun from '@logbun/js';
import LogbunErrorBoundary from './LogbunErrorBoundary';

Logbun.setSDK({
  name: '@logbun/react',
  url: 'https://github.com/logbun/logbun/tree/master/sdks/react',
  version: '__VERSION__',
});

export default Logbun;

export { LogbunErrorBoundary };
