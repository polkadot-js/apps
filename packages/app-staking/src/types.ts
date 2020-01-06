// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';
import { AccountId, Balance, BlockNumber, Hash, SessionIndex } from '@polkadot/types/interfaces';

export type Nominators = Record<string, string[]>;

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
