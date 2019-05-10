// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { DerivedBalances } from '@polkadot/api-derive/types';
import { formatBalance } from '@polkadot/util';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  balances_all?: DerivedBalances,
  children?: React.ReactNode,
  label?: string,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null
};

export class AvailableDisplay extends React.PureComponent<Props> {

  render () {
    const { balances_all, children, className, label = '', style } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          balances_all ?
          formatBalance(balances_all.availableBalance) :
          '0'
          }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  ['derive.balances.all', { paramName: 'params' }]
)(AvailableDisplay);
