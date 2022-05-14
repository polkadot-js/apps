// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from '../types';
import type { LinkOption } from './types';

import { defaultT } from '../util';
import { createCustom, createDev, createOwn } from './development';
import { hostedByPinknode } from './pinknode';
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
      text: 'Hosted by Pinknode',
      textBy: '',
      value: ''
    },
    ...expandEndpoints(t, hostedByPinknode, firstOnly, withSort),
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
