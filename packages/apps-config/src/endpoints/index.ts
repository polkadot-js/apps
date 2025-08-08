// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction, TOptions } from '../types.js';
import type { LinkOption } from './types.js';

import { createCustom, createDev, createOwn } from './development.js';
import { prodChains, prodRelayKusama, prodRelayPolkadot } from './production.js';
import { testChains, testRelayWestend } from './testing.js';
import { testRelayPaseo } from './testingRelayPaseo.js';
import { expandEndpoints } from './util.js';

export { CUSTOM_ENDPOINT_KEY } from './development.js';
export * from './production.js';
export * from './testing.js';

function defaultT (keyOrText: string, text?: string | TOptions, options?: TOptions): string {
  return (
    (options?.replace?.host as string) ||
    text?.toString() ||
    keyOrText
  );
}

export function createWsEndpoints (t: TFunction = defaultT, firstOnly = false, withSort = true): LinkOption[] {
  return [
    ...createCustom(t),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.favorite', 'Favorite chains', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.polkadot.relay', 'Polkadot & parachains', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...expandEndpoints(t, [prodRelayPolkadot], firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.kusama.relay', 'Kusama & parachains', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...expandEndpoints(t, [prodRelayKusama], firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.westend.relay', 'Test Westend & parachains', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...expandEndpoints(t, [testRelayWestend], firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.paseo.relay', 'Test Paseo & parachains', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...expandEndpoints(t, [testRelayPaseo], firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.live', 'Live networks', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...expandEndpoints(t, prodChains, firstOnly, withSort),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.test', 'Test networks', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...expandEndpoints(t, testChains, firstOnly, withSort),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...createDev(t),
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
