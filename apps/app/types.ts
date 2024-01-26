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

export type EventLevel = 'fatal' | 'error' | 'warning' | 'log' | 'info' | 'debug';
export interface EventStacktrace {
  columnNumber?: number;
  lineNumber?: number;
  fileName?: string;
  functionName?: string;
}
export interface EventResponse {
  id: string;
  name: string;
  message: string;
  level: EventLevel;
  handled: boolean;
  resolved: boolean;
  metadata?: string;
  stacktrace: EventStacktrace[];
  stack: string;
  sdk: string;
  os: string;
  osVersion: string;
  browser: string;
  browserVersion: string;
  device: string;
  release?: string;
  fingerprint: string;
  timestamp: number;
  projectId: string;
  sign: number;
}

export interface EventResultResponse extends EventResponse {
  count: number;
  createdAt: number;
  updatedAt: number;
}

export type Line = [number, string];

export type EventStacktraceResult = EventStacktrace & {
  preview?: Line[];
};
