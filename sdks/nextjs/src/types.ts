import { Client } from '@logbun/core';
import ClientLogbun, { LogbunErrorBoundary as ClientLogbunErrorBoundary } from '@logbun/react';
import { NextConfig } from 'next';
import { LogbunNextJsConfig } from './webpack';

// export * from './client';

// export * from './server';


export declare const Logbun: typeof ClientLogbun;

export declare const LogbunErrorBoundary: typeof ClientLogbunErrorBoundary;

export declare function withLogbunConfig(defaultConfig: NextConfig, logbunConfig: LogbunNextJsConfig): NextConfig;

// const a: typeof Logbun = {};
// a.
