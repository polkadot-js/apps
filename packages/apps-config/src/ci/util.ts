// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert, isError, isString } from '@polkadot/util';
import { fetch } from '@polkadot/x-fetch';

import { typesBundle, typesChain } from '../api';
import { createWsEndpoints } from '../endpoints';

interface Endpoint {
  name: string;
  ws: string;
}

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

const TICK = '`';

export function checkEndpoints (issueFile: string, failures: string[]): void {
  createWsEndpoints((k: string, v?: string) => v || k)
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
    .filter((v): v is Endpoint => !!v.ws)
    .forEach(({ name, ws }) =>
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
            throwOnUnknown: true,
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
              }, 60_000);
            }),
            api.isReadyOrError
          ]);
        } catch (error) {
          if (isError(error) && failures.some((f) => (error as Error).message.includes(f))) {
            process.env.CI_LOG && fs.appendFileSync(issueFile, `\n${TICK}${name} @ ${ws} ${error.message}${TICK}\n`);

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
}
