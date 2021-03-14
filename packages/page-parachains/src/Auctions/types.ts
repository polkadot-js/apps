// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AccountId, BalanceOf, ParaId } from '@polkadot/types/interfaces';

export interface WinnerData {
  accountId: AccountId;
  paraId: ParaId;
  range: [number, number];
  value: BalanceOf;
}

export interface Winning {
  blockNumber: BN;
  blockOffset: BN;
  total: BN;
  winners: WinnerData[];
}
