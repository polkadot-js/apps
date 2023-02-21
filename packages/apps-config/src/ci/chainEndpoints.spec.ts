// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, isString } from '@polkadot/util';
import { WebSocket } from '@polkadot/x-ws';

import { createWsEndpoints } from '../endpoints';
import { fetchJson } from './fetch';

interface Endpoint {
  name: string;
  ws: string;
}

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

const TIMEOUT = 60_000;

describe('check endpoints', (): void => {
  const checks = createWsEndpoints()
    .filter(({ isDisabled, isUnreachable, value }) =>
      !isDisabled &&
      !isUnreachable &&
      value &&
      isString(value) &&
      !value.includes('127.0.0.1') &&
      !value.startsWith('light://')
    )
    .map(({ text, value }): Partial<Endpoint> => ({
      name: text as string,
      ws: value
    }))
    .filter((v): v is Endpoint => !!v.ws);
  let completed = 0;
  let errored = 0;

  afterEach((): void => {
    completed++;

    if (completed === checks.length) {
      process.exit(errored);
    }
  });

  for (const c of checks) {
    const { name, ws: endpoint } = c;

    it(`${name} @ ${endpoint}`, async (): Promise<unknown> => {
      let websocket: WebSocket | null = null;
      const [,, hostWithPort] = endpoint.split('/');
      const [host] = hostWithPort.split(':');

      return fetchJson<DnsResponse>(`https://dns.google/resolve?name=${host}`)
        .then((json) =>
          assert(json && json.Answer, 'No DNS entry')
        )
        .then(() =>
          new Promise((resolve, reject): void => {
            websocket = new WebSocket(endpoint);

            websocket.onclose = (event: { code: number; reason: string }): void => {
              if (event.code !== 1000) {
                reject(new Error(`Disconnected, code: '${event.code}' reason: '${event.reason}'`));
              }
            };

            websocket.onerror = (): void => {
              reject(new Error('Connection error'));
            };

            websocket.onopen = (): void => {
              websocket?.send('{"id":"1","jsonrpc":"2.0","method":"state_getMetadata","params":[]}');
            };

            websocket.onmessage = (message: { data: string }): void => {
              try {
                const result = (JSON.parse(message.data) as { result: unknown }).result as string;

                assert(result.startsWith('0x'), 'Invalid response');
                resolve(result);
              } catch (e) {
                reject(e);
              }
            };
          })
        )
        .catch((e) => {
          errored++;

          throw e;
        })
        .finally(() => {
          if (websocket) {
            websocket.onclose = null;
            websocket.onerror = null;
            websocket.onopen = null;
            websocket.onmessage = null;

            try {
              websocket.close();
            } catch {
              // ignore
            }

            websocket = null;
          }
        });
    }, TIMEOUT);
  }
});
