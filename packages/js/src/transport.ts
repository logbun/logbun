import { Types } from '@logbun/core';

export default class BrowserTransport implements Types.Transport {
  private headers: Record<string, string> = {};

  constructor(headers: Record<string, string> = {}) {
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  public send = async <T>(options: Types.TransportOptions, payload?: T) => {
    const requestInit: RequestInit = {
      method: options.method || 'POST',
      headers: this.headers,
    };

    if (requestInit.method === 'POST' && payload) {
      requestInit.body = typeof payload === 'string' ? payload : JSON.stringify(payload);
    }

    console.log(requestInit);

    const response = await fetch(options.endpoint, requestInit);

    const body = await response.text();

    return Promise.resolve({ status: response.status, body });
  };
}
