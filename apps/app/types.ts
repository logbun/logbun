export interface Project {
  id: string;
  name: string;
  userId: string;
  apiKey: string;
  platform: string;
  integrationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventResponse {
  id: string;
  name: string;
  message: string;
  level: 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
  handled: boolean;
  resolved: boolean;
  metadata?: string;
  stacktrace: Array<{
    columnNumber?: number;
    lineNumber?: number;
    fileName?: string;
    functionName?: string;
  }>;
  stack: string;
  sdk: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  device: string;
  key: string;
  timestamp: number;
  projectId: string;
  sign: number;
}

export interface EventResultResponse extends EventResponse {
  count: number;
  createdAt: number;
  updatedAt: number;
}
