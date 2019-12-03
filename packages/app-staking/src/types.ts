// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances, DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AccountId, Balance, BlockNumber, Hash, SessionIndex } from '@polkadot/types/interfaces';

export type Nominators = Record<string, string[]>;

export interface ComponentProps {
  allAccounts: string[];
  allControllers: string[];
  allStashes: string[];
  bestNumber?: BlockNumber;
  className?: string;
  hasAccounts: boolean;
  hasQueries: boolean;
  recentlyOnline?: DerivedHeartbeats;
  sessionRewards: SessionRewards[];
  stakingOverview?: DerivedStakingOverview;
}

export interface CalculateBalanceProps {
  balances_fees?: DerivedFees;
  balances_all?: DerivedBalances;
}

export type AccountFilter = 'all' | 'controller' | 'session' | 'stash' | 'unbonded';

export type ValidatorFilter = 'all' | 'hasNominators' | 'noNominators' | 'hasWarnings' | 'noWarnings' | 'iNominated' | 'nextSet';

export interface Slash {
  accountId: AccountId;
  amount: Balance;
}

export interface SessionRewards {
  blockHash: Hash;
  blockNumber: BlockNumber;
  isEventsEmpty: boolean;
  parentHash: Hash;
  reward: Balance;
  sessionIndex: SessionIndex;
  slashes: Slash[];
  treasury: Balance;
}
