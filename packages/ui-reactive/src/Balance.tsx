// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BaseProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Balance } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';

import { balanceFormat } from './util/index';

type Props = BaseProps<any> & {
  children?: React.ReactNode,
  label?: string,
  params?: any | Array<any>,
  query_balances_freeBalance?: Balance
};

export default withCall('query.balances.freeBalance')(
class BalanceDisplay extends React.PureComponent<Props> {
  render (): React.ReactNode {
    const { children, className, label = '', style, query_balances_freeBalance } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          query_balances_freeBalance
            ? balanceFormat(query_balances_freeBalance)
            : '0'
          }{children}
      </div>
    );
  }
}
);
