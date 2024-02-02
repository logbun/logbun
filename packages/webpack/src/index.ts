import { Options as SourcemapOptions, uploadSourceMaps } from '@logbun/upload-sourcemaps';
import { join } from 'path';
import VError from 'verror';
import { Compiler } from 'webpack';

const PLUGIN_NAME = 'LogbunSourceMapPlugin';

type Options = SourcemapOptions & {
  silent?: boolean;
  ignoreErrors?: boolean;
  endpoint?: string;
};

export default class LogbunSourceMapPlugin {
  private uploadSourceMaps: typeof uploadSourceMaps;
  private options: Options;

  constructor(options: Options) {
    if (!options.apiKey) throw new Error('apiKey required');

    if (!options.endpoint) {
      options.endpoint = 'https://api.logbun.com';
    }

    this.uploadSourceMaps = uploadSourceMaps;
    this.options = options;
  }

  handleError(err: any = [], prefix = PLUGIN_NAME) {
    const errors = Array.isArray(err) ? err : [err];
    return errors.map((err) => new VError(err, prefix));
  }

  async afterEmit(compilation: any) {
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
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, this.afterEmit.bind(this));
  }

  isDevServerRunning() {
    return process.env.WEBPACK_DEV_SERVER === 'true';
  }

  getAssetPath(compilation: any, name: any) {
    if (!name) return '';

    return join(compilation.getPath(compilation.compiler.outputPath), name.split('?')[0]);
  }

  getAssets(compilation: any) {
    const { chunks } = compilation.getStats().toJson();
    return chunks
      .map(({ files, auxiliaryFiles }: any) => {
        const jsFilename = files.find((file: any) => /\.js$/.test(file));
        const jsFilePath = this.getAssetPath(compilation, jsFilename);
        const sourcemapFilename = (auxiliaryFiles || files).find((file: any) => /\.js\.map$/.test(file));
        const sourcemapFilePath = this.getAssetPath(compilation, sourcemapFilename);
        return { sourcemapFilename, sourcemapFilePath, jsFilename, jsFilePath };
      })
      .filter(({ sourcemapFilename, jsFilename }: any) => sourcemapFilename && jsFilename);
  }
}
