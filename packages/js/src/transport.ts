import { Types } from '@logbun/core';

export default class BrowserTransport implements Types.Transport {
  public send = async <T = string>(endpoint: string, event: Types.Event, customConfig: RequestInit = {}) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      credentials: 'same-origin',
      ...customConfig,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/json, application/json',
        body: JSON.stringify(event),
        ...customConfig.headers,
      },
    });

    const contentType = response.headers.get('content-type');

    if (!contentType) return Promise.resolve(null as T);

    let data = null as T;

    if (contentType.startsWith('application/json')) {
      const json = await response.json();
      data = json as T;
    }

    if (contentType.startsWith('text/plain')) {
      const text = await response.text();
      data = text as T;
    }

    if (!response.ok) {
      throw Error(response.statusText || 'An unexpected error occurred. Please try again');
    }

    return data;
  };
}
