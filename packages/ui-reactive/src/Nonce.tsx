// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { formatNumber } from '@polkadot/util';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  balances_all?: DerivedBalances,
  children?: React.ReactNode,
  label?: React.ReactNode,
  params?: string,
};

export class Nonce extends React.PureComponent<Props> {
  render () {
    const { balances_all, children, className, label = '' } = this.props;

    return (
      <div className={className}>
        {label}{
          balances_all
            ? formatNumber(balances_all.accountNonce)
            : '0'
        }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  ['derive.balances.all', { paramName: 'params' }]
)(Nonce);
