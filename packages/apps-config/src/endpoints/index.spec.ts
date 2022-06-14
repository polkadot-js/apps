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
        assert(value.startsWith('wss://') || value.startsWith('light://substrate-connect/'), `${name}:: ${provider} -> ${value} should start with wss:// or light:// without invalid characters`);
        assert(!INVALID_CHARS.some((c) => value.includes(c)), `${value} should not contain invalid characters such as ${INVALID_CHARS.join(', ')}`);
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

  Object
    .entries(map)
    .forEach(([url, paths]) =>
      it(url, (): void => {
        assert(paths.length === 1, `${url} appears multiple times - ${paths.map((p) => `\n\t"${p}"`).join('')}`);
      })
    );
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
