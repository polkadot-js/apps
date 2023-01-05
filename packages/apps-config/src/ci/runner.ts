// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import fs from 'fs';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { assert, isError, isString } from '@polkadot/util';

import { typesBundle } from '../api';
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

const TICK = '`';

function createChecker (issueFile: string, failures: string[]): (name: string, ws: string) => Promise<boolean> {
  return async (name: string, ws: string): Promise<boolean> => {
    const [,, hostWithPort] = ws.split('/');
    const [host] = hostWithPort.split(':');
    const json = await fetchJson<DnsResponse>(`https://dns.google/resolve?name=${host}`);

    let provider: WsProvider | null = null;
    let api: ApiPromise | null = null;
    let timerId: NodeJS.Timeout | null = null;
    let isOk = true;

    try {
      assert(json && json.Answer, `No DNS entry for ${host}`);

      provider = new WsProvider(ws, false);
      api = new ApiPromise({
        provider,
        throwOnConnect: true,
        throwOnUnknown: false,
        typesBundle
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
          .then((b) => console.log(`>>> ${name} @ ${ws}`, b.toHuman()))
      ]);
    } catch (error) {
      if (isError(error) && failures.some((f) => (error as Error).message.includes(f))) {
        process.env.CI_LOG && fs.appendFileSync(issueFile, `\n${TICK}${name} @ ${ws} ${error.message}${TICK}\n`);

        isOk = false;
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

    return isOk;
  };
}

export function checkEndpoints (issueFile: string, failures: string[]): void {
  const checker = createChecker(issueFile, failures);

  it.each(
    createWsEndpoints()
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
  )('$name @ $ws', async ({ name, ws }): Promise<void> => {
    expect(await checker(name, ws)).toBe(true);
  });
}
