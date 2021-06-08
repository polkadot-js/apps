// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, isString } from '@polkadot/util';

import { createWsEndpoints } from '.';

interface Endpoint {
  name: string;
  ws: string;
}

const endpoints = createWsEndpoints((k: string, v?: string) => v || k, true)
  .filter(({ value }) =>
    value && isString(value) && !value.includes('127.0.0.1')
  )
  .map((o): Partial<Endpoint> => ({ name: o.text as string, ws: o.value as string }))
  .filter((v): v is Endpoint => !!v.ws);

describe('urls are all valid', (): void => {
  endpoints.forEach(({ name, ws }) =>
    it(`${name} @ ${ws}`, (): void => {
      assert(ws.startsWith('wss://'), `Expected ${ws} endpoint to start with wss:// `);
    })
  );
});
