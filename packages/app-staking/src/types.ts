// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { AccountId, Balance, BlockNumber } from '@polkadot/types';

export type Nominators = {
  // stash account and who is being nominated
  [index: string]: Array<string>
};

export type ComponentProps = {
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  controllers: Array<string>,
  nominators: Nominators,
  recentlyOffline: RecentlyOfflineMap,
  stashes: Array<string>,
  validators: Array<string>
};

export type RecentlyOffline = Array<[AccountId, BlockNumber, BN]>;

export type RecentlyOfflineMap = {
  [s: string]: Array<OfflineStatus>
};

export interface OfflineStatus {
  blockNumber: BlockNumber;
  count: BN;
}

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';
