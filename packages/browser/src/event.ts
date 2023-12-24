import ErrorStackParser from 'error-stack-parser';

export class Event {
  public name: string;
  public message: string;
  public stacktrace: ErrorStackParser.StackFrame[];

  constructor(name: string, message: string, stacktrace: ErrorStackParser.StackFrame[]) {
    this.name = name;
    this.message = message;
    this.stacktrace = stacktrace;
  }

  public toJSON() {
    return {
      name: this.name,
      message: this.message,
      stacktrace: this.stacktrace,
    };
  }
}
