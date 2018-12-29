// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { Balance } from '@polkadot/types';

import { balanceFormat } from './util/index';
import { withApiPromise } from './with/index';

type Props = BareProps & {
  label?: string,
  query_balances_freeBalance: Balance
};

class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { className, label = '', style, query_balances_freeBalance } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          query_balances_freeBalance
            ? balanceFormat(query_balances_freeBalance)
            : '0'
          }
      </div>
    );
  }
}

export default withApiPromise('query.balances.freeBalance')(BalanceDisplay);
