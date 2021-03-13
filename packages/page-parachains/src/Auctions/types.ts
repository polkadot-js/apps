// Copyright 2017-2021 @polkadot/app-crowdloan authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AccountId, BalanceOf, ParaId } from '@polkadot/types/interfaces';

export interface WinnerData {
  accountId: AccountId;
  paraId: ParaId;
  range: string;
  value: BalanceOf;
}

export interface Winning {
  blockNumber: BN;
  winners: WinnerData[];
}
