// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExternalDef } from './types.js';

import { CereStats } from './cerestats.js';
import { Dotreasury } from './dotreasury.js';
import { KodaDot } from './kodadot.js';
import { Statescan } from './statescan.js';
import { Subscan } from './subscan.js';
import { Subsquare } from './subsquare.js';

export const externalLinks: Record<string, ExternalDef> = {
  CereStats,
  Dotreasury,
  KodaDot,
  Statescan,
  Subscan,
  Subsquare
};
