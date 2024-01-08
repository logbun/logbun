export interface EventResponse {
  id: string;
  name?: string;
  message?: string;
  timestamp?: string;
  level?: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  handled?: number;
  metadata?: string;
  stacktrace?: string;
  stack?: string;
  sdk?: string;
  os?: string;
  browser?: string;
  device?: string;
  fingerprint: string;
  apiKey: string;
  sign?: number;
}

export interface EventResultResponse extends EventResponse {
  count: number;
  createdAt: string;
  updatedAt: string;
  aggregate: string[];
}
