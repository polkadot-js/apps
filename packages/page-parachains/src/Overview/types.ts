// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { AccountId, BalanceOf, ParaId } from '@polkadot/types/interfaces';

export interface LeaseInfo {
  accountId: AccountId;
  balance: BalanceOf;
  period: number;
}

export interface QueuedAction {
  paraIds: ParaId[];
  sessionIndex: BN;
}

export interface EventMapInfo {
  blockHash: string;
  blockNumber: BN;
  relayParent: string;
}
