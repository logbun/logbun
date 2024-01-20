import Logbun from '@logbun/js';
import React from 'react';

export type Props = {
  logbun: typeof Logbun;
  children: React.ReactNode;
  fallback?: Function;
};

export type State = {
  error?: Error;
  info?: React.ErrorInfo;
};

export default class LogbunErrorBoundary extends React.Component<Props, State> {
  state = {
    error: undefined,
    info: undefined,
  };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: Error, info: React.ErrorInfo) {
    const { logbun } = this.props;

    const event = logbun.createEvent(error);

    logbun.broadcast(event);

    if (!this.state.error) this.setState({ error, info });
  }

  public render(): React.ReactNode {
    const { error } = this.state;
    const { fallback, children } = this.props;

    if (error) {
      return fallback ? fallback(error) : null;
    }

    return children;
  }
}
