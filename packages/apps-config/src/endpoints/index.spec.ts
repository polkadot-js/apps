// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { assert, isNumber, isString } from '@polkadot/util';

import { createWsEndpoints } from '.';

interface Endpoint {
  name: string;
  provider: string;
  value: string;
}

const allEndpoints = createWsEndpoints(undefined, false, false);

describe('WS urls are all valid', (): void => {
  allEndpoints
    .filter(({ value }) =>
      value &&
      isString(value) &&
      !value.includes('127.0.0.1')
    )
    .map(({ text, textBy, value }): Endpoint => ({
      name: text as string,
      provider: textBy,
      value
    }))
    .forEach(({ name, provider, value }) =>
      it(`${name}:: ${provider}`, (): void => {
        assert(value.startsWith('wss://') || value.startsWith('light://substrate-connect/'), `${name}:: ${provider} -> ${value} should start with wss:// or light://`);
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

  filtered.forEach(({ isHeader, text, textBy }, index): void => {
    if (isHeader) {
      lastHeader = text as string;
    } else {
      it(`${lastHeader}:: ${text as string}:: ${textBy}`, (): void => {
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

describe('endpopints do not contain emojis or all uppercase', (): void => {
  const emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;

  allEndpoints
    .filter(({ value }) =>
      value &&
      isString(value) &&
      !value.includes('127.0.0.1')
    )
    .map(({ text, textBy, value }): Endpoint => ({
      name: text as string,
      provider: textBy,
      value
    }))
    .forEach(({ name, provider }) =>
      it(`${name}:: ${provider}`, (): void => {
        assert(!emoji.test(name), `${name} should not contain any emojis`);
        assert(!emoji.test(provider), `${name}:: ${provider} should not contain any emojis`);
        assert(!provider.includes(' ') || (provider.toLocaleUpperCase() !== provider), `${name}:: ${provider} should not be all uppercase`);
      })
    );
});
