import { Options as SourcemapOptions, uploadSourceMaps } from '@logbun/upload-sourcemaps';
import { join } from 'path';
import VError from 'verror';
import { Compilation, Compiler, WebpackError } from 'webpack';

const PLUGIN_NAME = 'LogbunSourceMapPlugin';

export type Options = SourcemapOptions & {
  ignoreErrors?: boolean;
  endpoint?: string;
};

export default class LogbunSourceMapPlugin {
  private uploadSourceMaps: typeof uploadSourceMaps;
  private options: Options;

  constructor(options: Options) {
    if (!options.apiKey) throw new Error('apiKey required');

    if (!options.endpoint) {
      options.endpoint = 'https://api.logbun.com/sourcemap';
    }

    this.uploadSourceMaps = uploadSourceMaps;
    this.options = options;
  }

  handleError(error: unknown, prefix = PLUGIN_NAME) {
    const errors = Array.isArray(error) ? error : [error];
    const problems = errors.map((error) => new VError(error, prefix));
    return problems as WebpackError[];
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, async (compilation: Compilation) => {
      if (this.isDevServerRunning()) {
        if (!this.options.silent) {
          console.info(`${PLUGIN_NAME} will not upload source maps because webpack-dev-server is running.`);
        }
        return;
      }

      try {
        const assets = this.getAssets(compilation);
        await this.uploadSourceMaps(assets, this.options);
      } catch (err) {
        if (!this.options.ignoreErrors) {
          compilation.errors.push(...this.handleError(err));
        } else if (!this.options.silent) {
          compilation.warnings.push(...this.handleError(err));
        }
      }
    });
  }

  isDevServerRunning() {
    return process.env.WEBPACK_DEV_SERVER === 'true';
  }

  getAssetPath(compilation: Compilation, name?: string) {
    if (!name) return '';

    return join(compilation.getPath(compilation.compiler.outputPath), name.split('?')[0] || '');
  }

  getAssets(compilation: Compilation) {
    const { chunks = [] } = compilation.getStats().toJson();
    return chunks
      .map(({ files, auxiliaryFiles }) => {
        const mainFiles = files || [];

        const extraFiles = auxiliaryFiles || [];

        const allFiles = [...mainFiles, ...extraFiles];

        const jsFilename = mainFiles.find((file) => /\.js$/.test(file)) || '';

        const sourcemapFilename = allFiles.find((file) => /\.js\.map$/.test(file)) || '';

        const jsFilePath = this.getAssetPath(compilation, jsFilename);

        const sourcemapFilePath = this.getAssetPath(compilation, sourcemapFilename);

        return { sourcemapFilename, sourcemapFilePath, jsFilename, jsFilePath };
      })
      .filter(({ sourcemapFilename, jsFilename }) => sourcemapFilename && jsFilename);
  }
}
