// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';

import BN from 'bn.js';
import { AccountId, Balance, Vote } from '@polkadot/types';

export interface DeriveSubscription {
  (...params: Array<any>): UnsubFunction;
}

export type DerivedBalancesFees = {
  creationFee: BN,
  existentialDeposit: BN,
  transactionBaseFee: BN,
  transactionByteFee: BN,
  transferFee: BN
};

export type DerivedBalances = {
  accountId: AccountId,
  freeBalance: Balance,
  nominatedBalance: Balance,
  reservedBalance: Balance,
  votingBalance: Balance,
  stakingBalance: Balance,
  nominators?: Array<DerivedBalances>
};

export type DerivedBalancesMap = {
  [index: string]: DerivedBalances
};

export type DerivedReferendumVote = {
  accountId: AccountId,
  balance: Balance,
  vote: Vote
};
