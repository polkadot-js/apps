// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { LinkOption } from './types';

import { createRococo } from './testingRelayRococo';
import { createWestend } from './testingRelayWestend';
import { expandEndpoints } from './util';

export function createRococoRelay (t: TFunction, firstOnly?: boolean): LinkOption[] {
  return expandEndpoints(t, [createRococo(t)], firstOnly);
}

export function createWestendRelay (t: TFunction, firstOnly?: boolean): LinkOption[] {
  return expandEndpoints(t, [createWestend(t)], firstOnly);
}
