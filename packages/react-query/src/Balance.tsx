/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';
import { DerivedBalances } from '@polkadot/api-derive/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';

import { withCalls } from '@polkadot/react-api';
import { formatBalance } from '@polkadot/util';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  balances_all?: DerivedBalances;
}

export class BalanceDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, label = '', balances_all } = this.props;

    return (
      <div className={className}>
        {label}{
          balances_all
            ? formatBalance(balances_all.freeBalance)
            : '0'
        }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  ['derive.balances.all', { paramName: 'params' }]
)(BalanceDisplay);
