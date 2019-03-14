// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Balance } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api';
import { InputBalance } from '@polkadot/ui-app';

type Props = BareProps & CallProps & {
  balances_freeBalance?: Balance,
  label?: React.ReactNode
};

class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { className, label, style, balances_freeBalance } = this.props;

    return (
      <InputBalance
        className={className}
        isDisabled
        label={label}
        style={style}
        defaultValue={balances_freeBalance}
      />
    );
  }
}

export default withCall('query.balances.freeBalance')(BalanceDisplay);
