// Copyright 2017-2023 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExternalDef } from './types.js';

import { AzeroId, TzeroId } from './azeroId.js';
import { Subscan } from './subscan.js';

export const externalLinks: Record<string, ExternalDef> = {
  'AZERO.ID': AzeroId,
  'TZERO.ID': TzeroId,
  // eslint-disable-next-line sort-keys
  Subscan
};
