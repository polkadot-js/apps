// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export type DeriveSubscription = {
  subscribe: ((param: any, cb: (result?: any) => any) => Promise<number>) | ((cb: (result?: any) => any) => Promise<number>);
  unsubscribe: (subsciptionId: number) => Promise<any>;
};

export type DerivedBalancesFees = {
  creationFee: BN,
  existentialDeposit: BN,
  transactionBaseFee: BN,
  transactionByteFee: BN,
  transferFee: BN
};
