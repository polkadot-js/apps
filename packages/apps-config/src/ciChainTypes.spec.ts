// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LinkOption } from '@polkadot/apps-config/endpoints/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert, isError, isString } from '@polkadot/util';
import { fetch } from '@polkadot/x-fetch';

import { typesBundle, typesChain } from './api';
import { createWsEndpoints } from './endpoints';

interface Endpoint extends LinkOption {
  name: string;
  ws: string;
}

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

const FAILURES: string[] = [
  'Cannot construct unknown type'
];

const UNREACHABLE: string[] = [
  'No DNS entry for',
  'Timeout connecting to'
];

const endpoints = createWsEndpoints((k: string, v?: string) => v || k, true)
  .filter(({ isDisabled, value }) => !isDisabled && value && isString(value) && !value.startsWith('ws://'))
  .map((o): Partial<Endpoint> => ({ ...o, name: o.text as string, ws: o.value as string }))
  .filter((v): v is Endpoint => !!v.ws);

describe('--SLOW--: check configured chain connections', (): void => {
  endpoints.forEach(({ isUnreachable, name, ws }) =>
    it(`${name} @ ${ws}`, async (): Promise<void> => {
      const [,, hostWithPort] = ws.split('/');
      const [host] = hostWithPort.split(':');

      const response = await fetch(`https://dns.google/resolve?name=${host}`);
      const json = await response.json() as DnsResponse;

      let provider: WsProvider | null = null;
      let api: ApiPromise | null = null;
      let timerId: NodeJS.Timeout | null = null;

      try {
        assert(json.Answer, `No DNS entry for ${host}`);

        provider = new WsProvider(ws, false);
        api = new ApiPromise({
          provider,
          throwOnConnect: true,
          typesBundle,
          typesChain
        });

        setTimeout((): void => {
          provider && provider.connect().catch(() => undefined);
        }, 1000);

        await Promise.race([
          // eslint-disable-next-line promise/param-names
          new Promise((_, reject): void => {
            timerId = setTimeout((): void => {
              timerId = null;
              reject(new Error(`Timeout connecting to ${ws}`));
            }, 30_000);
          }),
          api.isReadyOrError
        ]);
      } catch (error) {
        const isThrowable = isError(error) && (
          FAILURES.some((f) => (error as Error).message.includes(f)) ||
          (
            !isUnreachable &&
            UNREACHABLE.some((f) => (error as Error).message.includes(f))
          )
        );

        if (isThrowable) {
          throw error;
        }
      } finally {
        if (timerId) {
          clearTimeout(timerId);
        }

        if (provider) {
          try {
            if (api) {
              await api.disconnect();
            } else {
              await provider.disconnect();
            }
          } catch {
            // ignore
          }
        }
      }
    })
  );
});
