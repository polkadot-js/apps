// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, isNumber, isString } from '@polkadot/util';

import { createWsEndpoints } from '.';

interface Endpoint {
  name: string;
  value: string;
}

const allEndpoints = createWsEndpoints((k: string, v?: string) => v || k, false, false);

describe('WS urls are all valid', (): void => {
  allEndpoints
    .filter(({ value }) =>
      value &&
      isString(value) &&
      !value.includes('127.0.0.1')
    )
    .map(({ text, value }): Endpoint => ({
      name: text as string,
      value
    }))
    .forEach(({ name, value }) =>
      it(`${name} @ ${value}`, (): void => {
        assert(value.startsWith('wss://') || value.startsWith('light://substrate-connect/'), `${name} @ ${value} should start with wss:// or light://`);
      })
    );
});

describe('urls are sorted', (): void => {
  let hasDevelopment = false;
  let lastHeader = '';
  const filtered = allEndpoints.filter(({ isHeader, text }): boolean => {
    hasDevelopment = hasDevelopment || (!!isHeader && text === 'Development');

    return !hasDevelopment;
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

describe('urls are not duplicated', (): void => {
  let hasDevelopment = false;
  let lastHeader = '';
  const filtered = allEndpoints.filter(({ isDisabled, isHeader, isUnreachable, text }): boolean => {
    hasDevelopment = hasDevelopment || (!!isHeader && text === 'Development');

    return !hasDevelopment && !isDisabled && !isUnreachable;
  });
  const map: Record<string, string[]> = {};

  filtered.forEach(({ isHeader, text, value }): void => {
    if (isHeader) {
      lastHeader = text as string;
    } else {
      const path = `${lastHeader} -> ${text as string}`;

      if (!map[value]) {
        map[value] = [path];
      } else {
        map[value].push(path);
      }
    }
  });

  it('has no duplicates, e.g. parachain & live', (): void => {
    expect(
      Object
        .entries(map)
        .filter(([, paths]) => paths.length !== 1)
    ).toEqual([]);
  });
});
