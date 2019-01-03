// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';

import BN from 'bn.js';

export interface DeriveSubscription {
  (...params: Array<any>): UnsubFunction;
  // (param: any, cb: (result?: any) => any): UnsubFunction;
  // (cb: (result?: any) => any): UnsubFunction;
}

export type DerivedBalancesFees = {
  creationFee: BN,
  existentialDeposit: BN,
  transactionBaseFee: BN,
  transactionByteFee: BN,
  transferFee: BN
};
