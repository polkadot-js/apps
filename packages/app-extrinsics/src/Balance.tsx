/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { DerivedBalances } from '@polkadot/api-derive/types';
import { withCalls, withMulti } from '@polkadot/react-api';
import { InputBalance } from '@polkadot/react-components';

type Props = BareProps & CallProps & {
  balances_all?: DerivedBalances;
  label?: React.ReactNode;
};

class BalanceDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
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
