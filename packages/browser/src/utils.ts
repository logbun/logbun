interface StackError extends Error {
  stacktrace?: string;
  'opera#sourceloc'?: string;
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

export function isStackError(error?: StackError) {
  if (!error) return false;

  const { stack, stacktrace, 'opera#sourceloc': operaSourceloc } = error;

  const hasStack = !!stack || !!stacktrace || !!operaSourceloc;
  const isStackString = typeof (stack || stacktrace || operaSourceloc) === 'string';
  const hasStackMessage = stack !== `${error.name}: ${error.message}`;

  return hasStack && isStackString && hasStackMessage;
}

export function normalizeError(error: unknown) {
  switch (typeof error) {
    case 'string':
    case 'number':
    case 'boolean':
      return new Error(String(error));
    case 'function':
      return new Error('Invalid error (function)');
    case 'object':
      if (error !== null && isError(error)) {
        return error as Error;
      }
      return new Error('Invalid error (object)');
    default:
      return new Error('Invalid error (unknown)');
  }
}
