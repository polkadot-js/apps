// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { strict as assert } from 'node:assert';

import { isNumber, isString } from '@polkadot/util';

import { createWsEndpoints } from './index.js';

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

  for (const { name, provider, value } of endpoints) {
    it(`${name}:: ${provider}`, (): void => {
      assert(value.startsWith('wss://') || value.startsWith('light://substrate-connect/'), `${name}:: ${provider} -> ${value} should start with wss:// or light://`);
      assert(!INVALID_CHARS.some((c) => value.includes(c)), `${value} should not contain invalid characters such as ${INVALID_CHARS.join(', ')}`);
    });
  }
});

describe('urls are sorted', (): void => {
  let hasDevelopment = false;
  let lastHeader = '';
  const filtered = allEndpoints.filter(({ isHeader, text }): boolean => {
    hasDevelopment = hasDevelopment || (!!isHeader && text === 'Development');

    return !hasDevelopment;
  });

  filtered.forEach(({ isHeader, paraId, text, textBy }, index): void => {
    if (isHeader) {
      lastHeader = text as string;
    } else {
      it(`${lastHeader}:: ${text as string}:: ${textBy}`, (): void => {
        const item = filtered[index - 1];

        assert((
          item.isHeader ||
          item.linked ||
          (
            isNumber(item.paraId) &&
            (
              item.paraId < 2000
                ? isNumber(paraId) && paraId >= 2000
                : false
            )
          ) ||
          item.text === '' ||
          text === item.text ||
          (text as string).localeCompare(item.text as string) === 1
        ), `${lastHeader}:: ${text as string} needs to be before ${item.text as string}`);
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

  for (const [url, paths] of Object.entries<string[]>(map)) {
    it(`${url}`, (): void => {
      assert(paths.length === 1, `${url} appears multiple times - ${paths.map((p) => `\n\t"${p}"`).join('')}`);
    });
  }
});

describe('endpopints naming', (): void => {
  const emoji = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/;
  const endpoints: Record<string, Endpoint> = allEndpoints
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
    .reduce((all, e) => ({
      ...all,
      [`${e.name}:: ${e.provider}`]: e
    }), {});

  for (const [key, { name, provider }] of Object.entries<Endpoint>(endpoints)) {
    describe(`${key}`, (): void => {
      it(`[${key}] has no emojis`, (): void => {
        assert(!emoji.test(name), `${name} should not contain any emojis`);
        assert(!emoji.test(provider), `${name}:: ${provider} should not contain any emojis`);
      });

      it(`[${key}] not all uppercase`, (): void => {
        assert(!provider.includes(' ') || (provider.toLocaleUpperCase() !== provider), `${name}:: ${provider} should not be all uppercase`);
      });

      it(`[${key}] does not contain "Parachain`, (): void => {
        assert(!name.includes('Parachain'), `${name} should not contain "Parachain" (redundant)`);
      });

      it(`[${key}] does not contain a relay name`, (): void => {
        assert(name.includes('Kusama') ? true : !name.includes(' ') || !name.includes('Kusama'), `${name} should not contain "Kusama" (redundant)`);
        assert(name.includes('Polkadot') ? true : !name.includes(' ') || !name.includes('Polkadot'), `${name} should not contain "Polkadot" (redundant)`);
        assert(name.includes('Rococo') ? true : !name.includes(' ') || !name.includes('Rococo'), `${name} should not contain "Rococo" (redundant)`);
        assert(name.includes('Westend') ? true : !name.includes(' ') || !name.includes('Westend'), `${name} should not contain "Westend" (redundant)`);
      });
    });
  }
});
