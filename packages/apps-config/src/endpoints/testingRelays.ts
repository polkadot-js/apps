// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from '../settings/types';

import { createRococo } from './testingRelayRococo';
import { createWestend } from './testingRelayWestend';
import { expandEndpoints } from './util';

export function createTestingRelays (t: TFunction): LinkOption[] {
  return expandEndpoints(t, [
    createRococo(t),
    createWestend(t)
  ]);
}
