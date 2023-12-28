import { Client } from './client';

export type SDK = {
  name: string;
  url: string;
  version: string;
};

export interface Plugin {
  load(client: Client): void;
}

export interface Config {
  apiKey?: string;
  debug?: boolean;
  endpoint?: string;
  environment?: string;
  logger?: Logger;
  sdk?: SDK;
  transport: Transport;
  plugins: Plugin[];
}

export interface Logger {
  log(...args: unknown[]): unknown;
  info(...args: unknown[]): unknown;
  debug(...args: unknown[]): unknown;
  warn(...args: unknown[]): unknown;
  error(...args: unknown[]): unknown;
}

export type TransportOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, number | string | string[] | undefined>;
  endpoint: string;
};

export interface Transport {
  send: <T = string>(options: TransportOptions, payload?: T) => Promise<{ status: number; body: string }>;
}

export interface Event {
  name: string;
  message: string;
  stacktrace: StackFrame[];
}

export interface ErrorEvent extends Event {
  timestamp: number;
}
