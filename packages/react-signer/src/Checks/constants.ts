// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedFees, DerivedBalances, DerivedContractFees } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import { createType } from '@polkadot/types';

const ZERO_BALANCE: DerivedBalances = {
  accountId: createType('AccountId'),
  accountNonce: createType('Index'),
  availableBalance: createType('Balance'),
  freeBalance: createType('Balance'),
  lockedBalance: createType('Balance'),
  lockedBreakdown: [],
  reservedBalance: createType('Balance'),
  vestedBalance: createType('Balance'),
  vestingTotal: createType('Balance'),
  votingBalance: createType('Balance')
};

const ZERO_FEES_BALANCES: DerivedFees = {
  creationFee: createType('Balance'),
  existentialDeposit: createType('Balance'),
  transactionBaseFee: createType('Balance'),
  transactionByteFee: createType('Balance'),
  transferFee: createType('Balance')
};

const ZERO_FEES = ZERO_FEES_BALANCES;

const ZERO_FEES_CONTRACT: DerivedContractFees = {
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
};

const MAX_SIZE_MB = 10;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

export {
  ZERO_BALANCE,
  ZERO_FEES,
  ZERO_FEES_BALANCES,
  ZERO_FEES_CONTRACT,
  MAX_SIZE_BYTES,
  MAX_SIZE_MB
};
