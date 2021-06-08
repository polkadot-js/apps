// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, isString } from '@polkadot/util';

import { createWsEndpoints } from '.';

interface Endpoint {
  name: string;
  ws: string;
}

describe('urls are all valid', (): void => {
  createWsEndpoints((k: string, v?: string) => v || k)
    .filter(({ value }) =>
      value &&
      isString(value) &&
      !value.includes('127.0.0.1')
    )
    .map(({ text, value }): Partial<Endpoint> => ({
      name: text as string,
      ws: value as string
    }))
    .filter((v): v is Endpoint => !!v.ws)
    .forEach(({ name, ws }) =>
      it(`${name} @ ${ws}`, (): void => {
        assert(ws.startsWith('wss://'), `${name} @ ${ws} should start with wss://`);
      })
    );
});
