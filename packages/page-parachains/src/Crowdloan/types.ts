// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AccountId, BalanceOf, FundInfo, ParaId } from '@polkadot/types/interfaces';

export interface Campaign {
  info: FundInfo;
  isCapped?: boolean;
  isEnded?: boolean;
  isRetired?: boolean;
  isWinner?: boolean;
  key: string;
  paraId: ParaId;
  retireEnd?: BN;
}

export interface LeaseLease {
  accountId: AccountId;
  balance: BalanceOf;
}

export interface Lease {
  leases: LeaseLease[];
  paraId: ParaId;
}
