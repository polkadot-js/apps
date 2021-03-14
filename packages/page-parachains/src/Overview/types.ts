// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

export interface LeasePeriod {
  currentPeriod: BN;
  length: BN;
  remainder: BN;
}
