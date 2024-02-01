import { ArgumentParser } from 'argparse';
import path from 'path';
import { description, version } from '../package.json';
import { uploadSourceMaps } from './sourcemaps';

const parser = new ArgumentParser({ description });

parser.add_argument('-v', '--version', { action: 'version', version });

parser.add_argument('-k', '--api-key', {
  help: 'API key',
  required: true,
});

parser.add_argument('-r', '--release', {
  help: 'Unique release key',
  required: false,
});

parser.add_argument('-e', '--endpoint', {
  help: 'API server URL for upload',
});

parser.add_argument('-s', '--sourcemap-file-path', {
  help: 'Local path to the sourcemap file',
  required: true,
});

parser.add_argument('-m', '--minified-file-path', {
  help: 'URL to the minified js file',
  required: true,
});

const { api_key, release, endpoint, sourcemap_file_path, minified_file_path } = parser.parse_args();

uploadSourceMaps(
  [
    {
      sourcemapFilePath: sourcemap_file_path,
      sourcemapFilename: path.basename(sourcemap_file_path),
      jsFilePath: minified_file_path,
      jsFilename: path.basename(minified_file_path),
    },
  ],
  { apiKey: api_key, release, endpoint }
)
  .then(() => {
    console.log('Sourcemaps uploaded successfully');
  })
  .catch((error) => {
    console.error(`Sourcemap upload error: ${error}`);
  });
