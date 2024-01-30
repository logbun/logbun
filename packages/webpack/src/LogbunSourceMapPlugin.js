import { uploadSourcemaps } from '@logbun/upload-sourcemaps';

const PLUGIN_NAME = 'LogbunSourceMapPlugin';

class LogbunSourceMapPlugin {
  constructor(options) {
    this.uploadSourcemaps = uploadSourcemaps;
    this.options = options;
  }

  async afterEmit(compilation) {
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
        compilation.errors.push(...handleError(err));
      } else if (!this.options.silent) {
        compilation.warnings.push(...handleError(err));
      }
    }
  }

  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise(PLUGIN_NAME, this.afterEmit.bind(this));
  }

  isDevServerRunning() {
    return process.env.WEBPACK_DEV_SERVER === 'true';
  }

  getAssetPath(compilation, name) {
    if (!name) {
      return '';
    }
    return join(compilation.getPath(compilation.compiler.outputPath), name.split('?')[0]);
  }

  getAssets(compilation) {
    const { chunks } = compilation.getStats().toJson();
    return chunks
      .map(({ files, auxiliaryFiles }) => {
        const jsFilename = files.find((file) => /\.js$/.test(file));
        const jsFilePath = this.getAssetPath(compilation, jsFilename);
        const sourcemapFilename = (auxiliaryFiles || files).find((file) => /\.js\.map$/.test(file));
        const sourcemapFilePath = this.getAssetPath(compilation, sourcemapFilename);
        return { sourcemapFilename, sourcemapFilePath, jsFilename, jsFilePath };
      })
      .filter(({ sourcemapFilename, jsFilename }) => sourcemapFilename && jsFilename);
  }
}

module.exports = LogbunSourceMapPlugin;
