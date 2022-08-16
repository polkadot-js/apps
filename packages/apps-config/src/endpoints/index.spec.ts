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

const INVALID_CHARS = ['%'];

describe('WS urls are all valid', (): void => {
  const endpoints = allEndpoints
    .filter(({ value }) =>
      value &&
      isString(value) &&
      !value.includes('127.0.0.1')
    )
    .map(({ text, textBy, value }): Endpoint => ({
      name: text as string,
      provider: textBy,
      value
    }));

  it.each(endpoints)('$name:: $provider', ({ name, provider, value }): void => {
    assert(value.startsWith('wss://') || value.startsWith('light://substrate-connect/'), `${name}:: ${provider} -> ${value} should start with wss:// or light://`);
    assert(!INVALID_CHARS.some((c) => value.includes(c)), `${value} should not contain invalid characters such as ${INVALID_CHARS.join(', ')}`);
  });
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
  const map = allEndpoints
    .filter(({ isDisabled, isHeader, isUnreachable, text }): boolean => {
      hasDevelopment = hasDevelopment || (!!isHeader && text === 'Development');

      return !hasDevelopment && !isDisabled && !isUnreachable;
    })
    .reduce((map, { isHeader, text, value }): Record<string, string[]> => {
      if (isHeader) {
        lastHeader = text as string;
      } else {
        const path = `${lastHeader} -> ${text as string}`;
        const key = value.endsWith('/')
          ? value.substring(0, value.length - 1)
          : value;

        map[key] ||= [];
        map[key].push(path);
      }

      return map;
    }, {} as Record<string, string[]>);

  it.each(Object.entries(map))('%s', (url, paths): void => {
    assert(paths.length === 1, `${url} appears multiple times - ${paths.map((p) => `\n\t"${p}"`).join('')}`);
  });
});

describe('endpopints naming', (): void => {
  const emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
  const endpoints = allEndpoints
    .filter(({ value }) =>
      value &&
      isString(value) &&
      !value.includes('127.0.0.1')
    )
    .map(({ text, textBy, value }): Endpoint => ({
      name: text as string,
      provider: textBy,
      value
    }));

  describe.each(endpoints)('$name:: $provider', ({ name, provider }): void => {
    it('name/provider has no emojis', (): void => {
      assert(!emoji.test(name), `${name} should not contain any emojis`);
      assert(!emoji.test(provider), `${name}:: ${provider} should not contain any emojis`);
    });

    it('provider not all uppercase', (): void => {
      assert(!provider.includes(' ') || (provider.toLocaleUpperCase() !== provider), `${name}:: ${provider} should not be all uppercase`);
    });

    it('does not contain "Parachain', (): void => {
      assert(!name.includes('Parachain'), `${name} should not contain "Parachain" (redundant)`);
    });

    it('does not contain a relay name', (): void => {
      assert(!name.includes(' ') || !name.includes('Kusama'), `${name} should not contain "Kusama" (redundant)`);
      assert(!name.includes(' ') || !name.includes('Polkadot'), `${name} should not contain "Polkadot" (redundant)`);
      assert(!name.includes(' ') || !name.includes('Rococo'), `${name} should not contain "Rococo" (redundant)`);
      assert(!name.includes(' ') || !name.includes('Westend'), `${name} should not contain "Westend" (redundant)`);
    });
  });
});
