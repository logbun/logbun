import fetch from 'isomorphic-unfetch';
import { BrowserOptions, ErrorEvent } from './types';

export class Api {
  private token: string;
  private endpoint: string;

  constructor(options: BrowserOptions) {
    this.token = options.token;
    this.endpoint = options.endpoint || 'https://logbun.com/api';
  }

  public postEvent(event: ErrorEvent) {
    return fetch(this.endpoint, {
      method: 'POST',
      body: JSON.stringify(event),
      headers: {
        'Content-Type': 'application/json',
        token: this.token,
      },
    }).then((response) => {
      if (response.ok) return response.json();
      throw new Error(response.statusText);
    });
  }
}
