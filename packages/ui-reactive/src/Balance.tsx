// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Balance } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';
import { formatBalance } from '@polkadot/ui-util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  balances_freeBalance?: Balance
};

class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, balances_freeBalance } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          balances_freeBalance
            ? formatBalance(balances_freeBalance)
            : '0'
          }{children}
      </div>
    );
  }
}

export default withCall('query.balances.freeBalance')(BalanceDisplay);
