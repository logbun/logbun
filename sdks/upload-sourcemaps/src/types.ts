export type Options = {
  apiKey: string;
  endpoint: string;
  assetUrl: string;
  release?: string;
  silent?: boolean;
};

export type Sourcemap = {
  sourcemapFilename: string;
  sourcemapFilePath: string;
  jsFilename: string;
  jsFilePath: string;
};
