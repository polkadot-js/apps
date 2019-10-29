/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';
import { AccountId, AccountIndex, Address, StakingLedger } from '@polkadot/types/interfaces';

import React from 'react';

import { withCalls } from '@polkadot/react-api';
import { formatBalance } from '@polkadot/util';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  label?: React.ReactNode;
  staking_ledger?: StakingLedger | null;
}

export function BondedDisplay ({ children, className, label = '', staking_ledger }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {label}{
        staking_ledger
          ? formatBalance(staking_ledger.active)
          : '-'
      }{children}
    </div>
  );
}

export default withCalls<Props>(
  ['query.staking.bonded', {
    paramName: 'params',
    propName: 'controllerId',
    transform: (value): AccountId | null =>
      value.unwrapOr(null)
  }],
  ['query.staking.ledger', {
    paramName: 'controllerId',
    transform: (value): StakingLedger | null =>
      value.unwrapOr(null)
  }]
)(BondedDisplay);
