// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { LinkOption } from './types';

import { defaultT } from '../util';
import { createCustom, createDev, createOwn } from './development';
import { prodChains, prodRelayKusama, prodRelayPolkadot } from './production';
import { testChains, testRelayRococo, testRelayWestend } from './testing';
import { expandEndpoints } from './util';

export { CUSTOM_ENDPOINT_KEY } from './development';
export * from './production';
export * from './testing';

export function createWsEndpoints (t: TFunction = defaultT, firstOnly = false, withSort = true): LinkOption[] {
  return [
    ...createCustom(t),
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
      text: t('rpc.header.rococo.relay', 'Test Rococo & parachains', { ns: 'apps-config' }),
      textBy: '',
      ui: {},
      value: ''
    },
    ...expandEndpoints(t, [testRelayRococo], firstOnly, withSort),
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
