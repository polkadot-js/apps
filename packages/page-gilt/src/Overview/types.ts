// Copyright 2017-2025 @polkadot/app-gilt authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ActiveGiltsTotal, BalanceOf } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

export interface QueueTotal {
  balance: BalanceOf;
  index: number;
  numItems: BN;
}

export interface GiltInfo {
  activeIndex?: BN | null;
  activeTotal?: ActiveGiltsTotal;
  queueTotals?: QueueTotal[];
}
