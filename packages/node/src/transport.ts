import { Types } from '@logbun/core';
import * as http from 'http';
import * as https from 'https';

export default class NodeTransport implements Types.Transport {
  private headers: Record<string, string> = {};

  constructor(headers: Record<string, string> = {}) {
    this.headers = headers;
  }

  public send = async <T>(options: Types.TransportOptions, payload?: T) => {
    const { protocol, hostname, pathname } = new URL(options.endpoint);
    const transport = protocol === 'http:' ? http : https;
    return new Promise<{ status: number; body: string }>((resolve: any, reject) => {
      const httpOptions = {
        method: options.method,
        headers: {
          ...this.headers,
          ...options.headers,
        },
        path: pathname,
        protocol,
        hostname,
      };

      let data: Buffer | undefined = undefined;

      if (payload) {
        const dataStr = typeof payload === 'string' ? payload : JSON.stringify(payload);
        data = Buffer.from(dataStr, 'utf8');
        httpOptions.headers['Content-Length'] = data.length;
      }

      const req = transport.request(httpOptions, (res) => {
        let body = '';
        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => resolve({ status: res.statusCode, body }));
      });

      req.on('error', (err) => reject(err));

      if (data) {
        req.write(data);
      }
      req.end();
    });
  };
}
