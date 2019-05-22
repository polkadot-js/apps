// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { DerivedBalances } from '@polkadot/api-derive/types';
import { withCalls, withMulti } from '@polkadot/ui-api';
import { InputBalance } from '@polkadot/ui-app';

type Props = BareProps & CallProps & {
  balances_all?: DerivedBalances,
  label?: React.ReactNode
};

class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { className, label, style, balances_all } = this.props;

    return (
      <InputBalance
        className={className}
        isDisabled
        label={label}
        style={style}
        defaultValue={balances_all && balances_all.freeBalance}
      />
    );
  }
}

export default withMulti(
  BalanceDisplay,
  withCalls<Props>(
    ['derive.balances.all', { paramName: 'params' }]
  )
);
