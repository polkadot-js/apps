// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert, isError, isString } from '@polkadot/util';
import { fetch } from '@polkadot/x-fetch';

import { typesBundle, typesChain } from './api';
import { createWsEndpoints } from './endpoints';

interface Endpoint {
  name: string;
  ws: string;
}

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

const endpoints = createWsEndpoints((k: string, v?: string) => v || k, true)
  .filter(({ isDisabled, value }) => !isDisabled && value && isString(value) && !value.startsWith('ws://'))
  .map(({ text, value }): Partial<Endpoint> => ({ name: text as string, ws: value as string }))
  .filter((v): v is Endpoint => !!v.ws);

describe('--SLOW--: check configured chain connections', (): void => {
  endpoints.forEach(({ name, ws }) =>
    it(`${name} @ ${ws}`, async (): Promise<void> => {
      const [,, hostWithPort] = ws.split('/');
      const [host] = hostWithPort.split(':');

      const response = await fetch(`https://dns.google/resolve?name=${host}`);
      const json = await response.json() as DnsResponse;

      assert(json.Answer, `No DNS entry for ${host}`);

      let provider: WsProvider | null = null;
      let api: ApiPromise | null = null;

      try {
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

        await api.isReadyOrError;
      } catch (error) {
        if (isError(error) && error.message.includes('Cannot construct unknown type')) {
          throw error;
        }
      } finally {
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
