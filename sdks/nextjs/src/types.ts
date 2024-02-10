import ClientLogbun, { LogbunErrorBoundary as ClientLogbunErrorBoundary } from '@logbun/react';
import { NextConfig } from 'next';
import { LogbunNextJsConfig } from './webpack';

export declare const Logbun: typeof ClientLogbun;

export declare const LogbunErrorBoundary: typeof ClientLogbunErrorBoundary;

export declare function withLogbunConfig(defaultConfig: NextConfig, logbunConfig: LogbunNextJsConfig): NextConfig;

export interface LogbunConfig extends LogbunNextJsConfig {}
