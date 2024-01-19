import ErrorStackParser from 'error-stack-parser';
import StackGenerator from 'stack-generator';
import { Event } from './types';

export function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  return window;
}

export function getErrorStacktrace(error: Error) {
  if (isStackError(error)) {
    return ErrorStackParser.parse(error);
  }

  return StackGenerator.backtrace({ maxStackSize: 10 });
}

export function isError(exception: unknown) {
  const object = Object.prototype.toString.call(exception);
  switch (object) {
    case '[object Error]':
    case '[object Exception]':
    case '[object DOMException]':
      return true;
    default:
      return exception instanceof Error;
  }
}

export function isStackError(error?: Error & { stacktrace?: string; 'opera#sourceloc'?: string }) {
  if (!error) return false;

  const { stack, stacktrace, 'opera#sourceloc': operaSourceloc } = error;

  const hasStack = !!stack || !!stacktrace || !!operaSourceloc;

  const isStackString = typeof (stack || stacktrace || operaSourceloc) === 'string';

  const hasStackMessage = stack !== `${error.name}: ${error.message}`;

  return hasStack && isStackString && hasStackMessage;
}

export function normalizeError(exception: unknown) {
  let error = new Error(`Application received an unexpected ${exception === null ? 'null' : typeof exception} type`);

  error.name = 'Invalid Error';

  switch (typeof exception) {
    case 'string':
    case 'number':
    case 'boolean':
      error = new Error(String(exception));
      break;
    case 'object':
      if (exception !== null) {
        if (isError(exception)) {
          error = exception as Error;
        } else if ('name' in exception && 'message' in exception && typeof exception.message === 'string') {
          error = new Error(exception.message);
          if (typeof exception.name === 'string') {
            error.name = exception.name;
          }
        }
      }
      break;
    default:
  }

  return error;
}

export function createEvent(error: unknown): Event {
  const exception = normalizeError(error);

  const stacktrace = getErrorStacktrace(exception);

  const backtrace = stacktrace.splice(0, calculateStackShift(stacktrace));

  return {
    name: exception.name,
    message: exception.message,
    stacktrace: backtrace,
  };
}

export function calculateStackShift(stacks: ErrorStackParser.StackFrame[]) {
  const defaultShift = 3;

  let shift = 0;

  const isLogBunFrame = ({ fileName, functionName }: ErrorStackParser.StackFrame) => {
    return fileName?.includes('logbun') || functionName?.includes('logbun');
  };

  stacks.forEach((frame, index, frames) => {
    if (isLogBunFrame(frame)) {
      shift += 1;
    } else if (!frame.fileName || frame.fileName === '<anonymous>') {
      const next = frames[index + 1];
      if (next && isLogBunFrame(next)) {
        shift += 1;
      } else {
        return; // Break when a non Logbun frame is encountered
      }
    }
  });

  return shift || defaultShift;
}
