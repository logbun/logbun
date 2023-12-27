// import { BrowserOptions } from '@logbun/js/src/types';
import { init as initReact } from '@logbun/react/index';

export { ErrorBoundary } from './ErrorBoundary';

export const init = (options: any | string) => {
  return initReact(options);
};
