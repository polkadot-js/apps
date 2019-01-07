// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { UnsubFunction } from '@polkadot/api/promise/types';
import { DeriveSubscription, DerivedBalancesFees } from '../types';

import BN from 'bn.js';
import ApiPromise from '@polkadot/api/promise';

export default function fees (api: ApiPromise): DeriveSubscription {
  return (cb: (fees: DerivedBalancesFees) => any): UnsubFunction =>
    api.combineLatest([
      api.query.balances.creationFee,
      api.query.balances.existentialDeposit,
      api.query.balances.transactionBaseFee,
      api.query.balances.transactionByteFee,
      api.query.balances.transferFee
    ], ([creationFee, existentialDeposit, transactionBaseFee, transactionByteFee, transferFee]) =>
      cb({
        creationFee: creationFee || new BN(0),
        existentialDeposit: existentialDeposit || new BN(0),
        transactionBaseFee: transactionBaseFee || new BN(0),
        transactionByteFee: transactionByteFee || new BN(0),
        transferFee: transferFee || new BN(0)
      })
    );
}
