// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances, DerivedContractFees } from '@polkadot/api-derive/types';

import BN from 'bn.js';

export const ZERO_BALANCE = {
  availableBalance: new BN(0),
  lockedBalance: new BN(0),
  freeBalance: new BN(0),
  reservedBalance: new BN(0),
  vestedBalance: new BN(0),
  votingBalance: new BN(0)
} as DerivedBalances;

export const ZERO_FEES_BALANCES = {
  transactionBaseFee: new BN(0),
  transactionByteFee: new BN(0),
  creationFee: new BN(0),
  existentialDeposit: new BN(0),
  transferFee: new BN(0)
} as DerivedFees;

export const ZERO_FEES = ZERO_FEES_BALANCES;

export const ZERO_FEES_CONTRACT = {
  callBaseFee: new BN(0),
  contractFee: new BN(0),
  createBaseFee: new BN(0),
  creationFee: new BN(0),
  rentByteFee: new BN(0),
  rentDepositOffset: new BN(0),
  transactionBaseFee: new BN(0),
  transactionByteFee: new BN(0),
  transferFee: new BN(0),
  tombstoneDeposit: new BN(0)
} as DerivedContractFees;

export const MAX_SIZE_MB = 10;
export const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
