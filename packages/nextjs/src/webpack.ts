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
const addLogbunConfigToEntry = async (configType: string, originalEntry: any, projectDir: string) => {
  // See if config file exists, if it does store it
  const configs = [`logbun.${configType}.config.ts`, `logbun.${configType}.config.js`];

  let logbunConfigFile = '';

  for (const filename of configs) {
    if (fs.existsSync(path.resolve(projectDir, filename))) {
      logbunConfigFile = filename;
    }
  }

  if (!logbunConfigFile) {
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

    const addEdge = configType === 'edge';

    const configFile = `./${logbunConfigFile}`;

    const entryPoint = value;

    let newEntryPoint = entryPoint;

    if (addServer || addClient || addEdge) {
      if (typeof entryPoint === 'string') {
        newEntryPoint = [configFile, entryPoint];
      } else if (Array.isArray(entryPoint)) {
        newEntryPoint = [configFile, ...entryPoint];
      } else if (entryPoint && typeof entryPoint === 'object' && 'import' in entryPoint) {
        const origImport = entryPoint.import as string | string[];

        let newImport = [configFile];

        if (typeof origImport === 'string') {
          newImport.push(origImport);
        } else {
          newImport.push(...origImport);
        }

        newEntryPoint = { ...entryPoint, import: newImport };
      } else {
        console.error('Could not inject file');
      }

      currentEntries[key] = newEntryPoint;
    }
  });

  return currentEntries;
};

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

      result.entry = async () => addLogbunConfigToEntry(configType, originalEntry, projectDir);

      result.devtool = 'hidden-source-map';

      result.plugins = result.plugins || [];

      if (
        !logbunConfig.disableSourceMapUpload &&
        logbunConfig.webpackPluginOptions?.apiKey &&
        process.env.NODE_ENV === 'production'
      ) {
        result.plugins.push(
          new LogbunSourceMapPlugin({
            ...logbunConfig.webpackPluginOptions,
            endpoint: logbunConfig.webpackPluginOptions.endpoint || process.env.NEXT_PUBLIC_LOGBUN_SOURCEMAPS_URL || '',
          })
        );
      }

      return result;
    },
  };
}
