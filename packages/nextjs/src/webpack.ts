import LogbunSourceMapPlugin from '@logbun/webpack';
import fs from 'fs';
import { NextConfig } from 'next';
import path from 'path';

export type LogbunNextJsConfig = {
  silent?: boolean;
  disableSourceMapUpload?: boolean;
  webpackPluginOptions?: {
    apiKey: string;
    release?: string;
    endpoint?: string;
  };
};

// This function finds a logbun config file and adds it to webpack.entry array
export function withLogbunConfig(defaultConfig: NextConfig, logbunConfig: LogbunNextJsConfig): NextConfig {
  return {
    ...defaultConfig,
    webpack: (webpackConfig, context) => {
      const { isServer, dir: projectDir, nextRuntime } = context;

      const configType = isServer ? (nextRuntime === 'edge' ? 'edge' : 'server') : 'client';

      let result = { ...webpackConfig };

      const originalEntry = result.entry;

      if (typeof defaultConfig.webpack === 'function') {
        result = defaultConfig.webpack(result, context);
      }

      result.entry = async () => {
        // See if config file exists, if it does store it
        const configs = [`logbun.${configType}.config.ts`, `logbun.${configType}.config.js`];

        let logbunConfigFile = '';

        for (const filename of configs) {
          if (fs.existsSync(path.resolve(projectDir, filename))) {
            logbunConfigFile = filename;
          }
        }

        if (!logbunConfigFile) {
          console.debug(`Logbun ${configType} config file not found. Using current nextjs config file`);
          return originalEntry;
        }

        // We want to append the logbun config file path to keys that start with pages/ on server and main-app or pages/_app on browser
        const currentEntries: { [key: string]: string | object } =
          typeof originalEntry === 'function' ? await originalEntry() : { ...originalEntry };

        if (!Object.keys(currentEntries).length) {
          console.debug(`No entry points for configType[${configType}]`);
        }

        Object.entries(currentEntries).forEach(([key, value]) => {
          const addServer = configType === 'server' && key.startsWith('pages/');

          const addClient = configType === 'client' && ['pages/_app', 'main-app'].includes(key);

          if (addServer || addClient) {
            if (typeof value === 'string') {
              currentEntries[key] = [value, `./${logbunConfigFile}`];
            } else if (Array.isArray(value)) {
              currentEntries[key] = [...value, `./${logbunConfigFile}`];
            } else if (value && typeof value === 'object' && 'import' in value) {
              const origImport = value.import as string | string[];

              let newImport = [`./${logbunConfigFile}`];

              if (typeof origImport === 'string') {
                newImport = [...newImport, origImport];
              } else {
                newImport = [...newImport, ...origImport];
              }

              currentEntries[key] = { ...value, import: newImport };
            } else {
              console.error('Could not inject file');
            }
          }
        });

        return currentEntries;
      };

      result.devtool = 'hidden-source-map';

      if (!result.plugins) {
        result.plugins = [];
      }

      if (
        !logbunConfig.disableSourceMapUpload &&
        logbunConfig.webpackPluginOptions?.apiKey &&
        process.env.NODE_ENV === 'production'
      ) {
        result.plugins.push(new LogbunSourceMapPlugin(logbunConfig.webpackPluginOptions));
      }

      return result;
    },
  };
}
