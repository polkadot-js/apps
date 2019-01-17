// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances } from '@polkadot/api-derive/types';

import BN from 'bn.js';

export const ZERO_BALANCE = {
  freeBalance: new BN(0),
  reservedBalance: new BN(0),
  votingBalance: new BN(0)
} as DerivedBalances;

export const ZERO_FEES = {
  transactionBaseFee: new BN(0),
  transactionByteFee: new BN(0),
  creationFee: new BN(0),
  existentialDeposit: new BN(0),
  transferFee: new BN(0)
} as DerivedFees;
