// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { createKusama } from './productionRelayKusama';
import { createPolkadot } from './productionRelayPolkadot';
import { expandEndpoints } from './util';

export function createKusamaRelay (t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [createKusama(t)], firstOnly, withSort);
}

export function createPolkadotRelay (t: TFunction, firstOnly: boolean, withSort: boolean): LinkOption[] {
  return expandEndpoints(t, [createPolkadot(t)], firstOnly, withSort);
}
