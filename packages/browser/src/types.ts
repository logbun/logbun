export interface BrowserOptions {
  token: string;
  debug?: boolean;
  endpoint?: string;
  metadata: {
    sdk: {
      name: string;
      version: string;
      url: string;
    };
  };
}

export interface LoggerOptions {
  debug: (...data: any[]) => void;
  info: (...data: any[]) => void;
  warn: (...data: any[]) => void;
  error: (...data: any[]) => void;
}

export interface ErrorEvent {
  timestamp: number;
  host: string;
  name: string;
  message: string;
  stacktrace: StackFrame[];
}
