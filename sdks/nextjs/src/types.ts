import { Client } from '@logbun/core';
import { NextConfig } from 'next';
import { type LogbunErrorBoundary as ClientLogbunErrorBoundary } from './client';
import { LogbunNextJsConfig } from './webpack';

export interface Logbun extends Client {}

export declare function withLogbunConfig(defaultConfig: NextConfig, logbunConfig: LogbunNextJsConfig): NextConfig;

export interface LogbunErrorBoundary extends ClientLogbunErrorBoundary {}
