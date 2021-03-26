// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BalanceOf, FundInfo, ParaId } from '@polkadot/types/interfaces';

export interface Campaign {
  info: FundInfo;
  isCapped?: boolean;
  isEnded?: boolean;
  isWinner?: boolean;
  key: string;
  paraId: ParaId;
}

export interface LeaseLease {
  accountId: AccountId;
  balance: BalanceOf;
}

export interface Lease {
  leases: LeaseLease[];
  paraId: ParaId;
}
