// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { assert, isString } from '@polkadot/util';
import { WebSocket } from '@polkadot/x-ws';

import { createWsEndpoints } from '../endpoints/index.js';
import { fetchJson } from './fetch.js';

interface Endpoint {
  name: string;
  ws: string;
}

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

const TIMEOUT = 60_000;

function noopHandler () {
  // ignore
}

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

  for (const { name, ws: endpoint } of checks) {
    it(`${name} @ ${endpoint}`, async (): Promise<void> => {
      const [,, hostWithPort] = endpoint.split('/');
      const [host] = hostWithPort.split(':');
      let websocket: WebSocket | null = null;
      let closeTimerId: ReturnType<typeof setTimeout> | null = null;

      await fetchJson<DnsResponse>(`https://dns.google/resolve?name=${host}`)
        .then((json) =>
          assert(json?.Answer, 'No DNS entry')
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
                const result = (JSON.parse(message.data) as { result?: string }).result;

                assert(result?.startsWith('0x'), 'Invalid/non-hex response');
                resolve(result);
              } catch (e) {
                reject(e);
              }
            };

            closeTimerId = setTimeout(
              () => {
                closeTimerId = null;
                reject(new Error('Connection timeout'));
              },
              TIMEOUT
            );
          })
        )
        .finally(() => {
          if (closeTimerId) {
            clearTimeout(closeTimerId);
            closeTimerId = null;
          }

          if (websocket) {
            websocket.onclose = noopHandler;
            websocket.onerror = noopHandler;
            websocket.onopen = noopHandler;
            websocket.onmessage = noopHandler;

            try {
              websocket.close();
            } catch (e) {
              console.error((e as Error).message);
            }

            websocket = null;
          }
        });
    });
  }
});
