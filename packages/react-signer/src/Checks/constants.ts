// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveFees, DeriveBalancesAll, DeriveContractFees } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import { registry } from '@polkadot/react-api';
import { createType } from '@polkadot/types';

const ZERO_BALANCE: DeriveBalancesAll = {
  accountId: createType(registry, 'AccountId'),
  accountNonce: createType(registry, 'Index'),
  availableBalance: createType(registry, 'Balance'),
  freeBalance: createType(registry, 'Balance'),
  frozenFee: createType(registry, 'Balance'),
  frozenMisc: createType(registry, 'Balance'),
  isVesting: false,
  lockedBalance: createType(registry, 'Balance'),
  lockedBreakdown: [],
  reservedBalance: createType(registry, 'Balance'),
  vestedBalance: createType(registry, 'Balance'),
  vestingTotal: createType(registry, 'Balance'),
  votingBalance: createType(registry, 'Balance')
};

const ZERO_FEES_BALANCES: DeriveFees = {
  creationFee: createType(registry, 'Balance'),
  existentialDeposit: createType(registry, 'Balance'),
  transactionBaseFee: createType(registry, 'Balance'),
  transactionByteFee: createType(registry, 'Balance'),
  transferFee: createType(registry, 'Balance')
};

const ZERO_FEES = ZERO_FEES_BALANCES;

const ZERO_FEES_CONTRACT: DeriveContractFees = {
  callBaseFee: new BN(0),
  contractFee: new BN(0),
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
