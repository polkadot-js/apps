// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ParaId } from '@polkadot/types/interfaces';

export interface LeasePeriod {
  currentPeriod: BN;
  length: BN;
  remainder: BN;
}

export interface QueuedAction {
  paraIds: ParaId[];
  sessionIndex: BN;
}
