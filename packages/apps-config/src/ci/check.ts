// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert, isError } from '@polkadot/util';

import { typesBundle, typesChain } from '../api';
import { fetchJson } from './fetch';

interface DnsResponse {
  Answer?: { name: string }[];
  Question: { name: string }[];
}

const TICK = '`';

export function checkEndpoint (issueFile: string, failures: string[]): (name: string, ws: string) => Promise<boolean> {
  return async (name: string, ws: string): Promise<boolean> => {
    const [,, hostWithPort] = ws.split('/');
    const [host] = hostWithPort.split(':');
    const json = await fetchJson<DnsResponse>(`https://dns.google/resolve?name=${host}`);

    let provider: WsProvider | null = null;
    let api: ApiPromise | null = null;
    let timerId: NodeJS.Timeout | null = null;

    try {
      assert(json.Answer, `No DNS entry for ${host}`);

      provider = new WsProvider(ws, false);
      api = new ApiPromise({
        provider,
        throwOnConnect: true,
        throwOnUnknown: false,
        typesBundle,
        typesChain
      });

      setTimeout((): void => {
        provider &&
          provider
            .connect()
            .catch(() => undefined);
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
          .then((a) => a.rpc.chain.getBlock())
          .then((b) => console.log(b.toHuman()))
      ]);
    } catch (error) {
      if (isError(error) && failures.some((f) => (error as Error).message.includes(f))) {
        process.env.CI_LOG && fs.appendFileSync(issueFile, `\n${TICK}${name} @ ${ws} ${error.message}${TICK}\n`);

        throw error;
      }

      console.error(JSON.stringify(error));
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

    return Promise.resolve(true);
  };
}
