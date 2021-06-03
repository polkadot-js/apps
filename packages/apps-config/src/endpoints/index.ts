// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { createCustom, createDev, createOwn } from './development';
import { createProduction } from './production';
import { createProductionRelays } from './productionRelays';
import { createTesting } from './testing';
import { createTestingRelays } from './testingRelays';

export { CUSTOM_ENDPOINT_KEY } from './development';

export function createWsEndpoints (t: TFunction): LinkOption[] {
  return [
    ...createCustom(t),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.live.relay', 'Live relays & parachains', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createProductionRelays(t),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.test.relay', 'Test relays & parachains', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createTestingRelays(t),
    {
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.live', 'Live networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createProduction(t),
    {
      isDisabled: false,
      isHeader: true,
      text: t('rpc.header.test', 'Test networks', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createTesting(t),
    {
      isDevelopment: true,
      isDisabled: false,
      isHeader: true,
      isSpaced: true,
      text: t('rpc.header.dev', 'Development', { ns: 'apps-config' }),
      textBy: '',
      value: ''
    },
    ...createDev(t),
    ...createOwn(t)
  ].filter(({ isDisabled }) => !isDisabled);
}
