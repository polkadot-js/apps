// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { createKusama } from './productionRelayKusama';
import { createPolkadot } from './productionRelayPolkadot';
import { expandEndpoints } from './util';

export function createProductionRelays (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [
    createPolkadot(t),
    createKusama(t)
  ]);
}
