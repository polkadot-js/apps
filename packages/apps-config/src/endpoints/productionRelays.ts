// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { createKusama } from './productionRelayKusama';
import { createPolkadot } from './productionRelayPolkadot';
import { expandEndpoints } from './util';

export function createProductionRelays (t: TFunction, firstOnly?: boolean): LinkOption[] {
  return expandEndpoints(t, [
    createPolkadot(t),
    createKusama(t)
  ], firstOnly);
}
