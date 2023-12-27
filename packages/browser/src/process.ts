import ErrorStackParser from 'error-stack-parser';
import StackGenerator from 'stack-generator';
import { Event } from './event';
import { isError, isStackError, normalizeError } from './utils';

function getErrorStacktrace(error: Error) {
  const problem = normalizeError(error);

  if (isStackError(problem)) {
    return ErrorStackParser.parse(problem);
  }

  return StackGenerator.backtrace({ maxStackSize: 10 });
}

// Move to client method
export function createEvent(error: Error) {
  if (isError(error)) {
    const stacktrace = getErrorStacktrace(error);

    return new Event(error.name, error.message, stacktrace);
  }

  return new Event('NullError', 'No error has been set', []);
}
