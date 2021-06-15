// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, isNumber, isString } from '@polkadot/util';

import { createWsEndpoints } from '.';

interface Endpoint {
  name: string;
  ws: string;
}

const allEndpoints = createWsEndpoints((k: string, v?: string) => v || k);

describe('urls are all valid', (): void => {
  allEndpoints
    .filter(({ value }) =>
      value &&
      isString(value) &&
      !value.includes('127.0.0.1')
    )
    .map(({ text, value }): Endpoint => ({
      name: text as string,
      ws: value
    }))
    .forEach(({ name, ws }) =>
      it(`${name} @ ${ws}`, (): void => {
        assert(ws.startsWith('wss://'), `${name} @ ${ws} should start with wss://`);
      })
    );
});

describe('urls are sorted', (): void => {
  let hasDevelopment = false;
  let lastHeader = '';
  const filtered = allEndpoints.filter(({ isHeader, isUnreachable, text }): boolean => {
    hasDevelopment = hasDevelopment || (!!isHeader && text === 'Development');

    return !isUnreachable && !hasDevelopment;
  });

  filtered.forEach(({ isHeader, text }, index): void => {
    if (isHeader) {
      lastHeader = text as string;
    } else {
      it(`${lastHeader}:: ${text as string}`, (): void => {
        assert((
          filtered[index - 1].isHeader ||
          filtered[index - 1].linked ||
          (isNumber(filtered[index - 1].paraId) && (filtered[index - 1].paraId as number) < 2000) ||
          filtered[index - 1].text === '' ||
          text === filtered[index - 1].text ||
          (text as string).localeCompare(filtered[index - 1].text as string) === 1
        ), `${lastHeader}:: ${text as string} needs to be before ${filtered[index - 1].text as string}`);
      });
    }
  });
});
