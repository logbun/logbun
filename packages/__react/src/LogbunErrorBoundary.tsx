// import { Client } from '@logbun/js/src';
import React from 'react';

export type Props = {
  client: any;
  children: React.ReactNode;
  fallback?: Function;
};

export type State = {
  error?: Error;
};

export class LogbunErrorBoundary extends React.Component<Props, State> {
  state = { error: undefined };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  public componentDidCatch(error: Error) {
    const { client } = this.props;

    const event = client.createEvent(error);

    client.sendEvent(event);

    if (!this.state.error) this.setState({ error });
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
