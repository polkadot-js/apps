// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Option, StakingLedger } from '@polkadot/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';

import { withCalls } from '@polkadot/ui-api';
import { formatBalance } from '@polkadot/util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  label?: string,
  staking_ledger?: Option<StakingLedger>
};

export class BondedDisplay extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', staking_ledger } = this.props;

    if (!staking_ledger || staking_ledger.isNone) {
      return null;
    }

    const { active: bonded } = staking_ledger.unwrap();

    return (
      <>
        <span className={className + ' label-bonded'}>
          {label}
        </span>
        <span className={className + ' result-bonded'}>
          {
            bonded
              ? formatBalance(bonded)
              : '0'
          }
        </span>
        {children}
      </>
    );
  }
}

export default withCalls<Props>(
  ['query.staking.bonded', {
    paramName: 'params',
    propName: 'controllerId',
    transform: (value) =>
      value.unwrapOr(null)
  }],
  ['query.staking.ledger', { paramName: 'controllerId' }]
)(BondedDisplay);
