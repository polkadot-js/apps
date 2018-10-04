// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types';
import RxBalance from '@polkadot/ui-react-rx/Balance';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

import classes from './util/classes';

export type Props = BareProps & {
  balance?: Balance | Array<Balance> | BN,
  label?: string,
  value: AccountId | AccountIndex | Address | string | Uint8Array,
  withLabel?: boolean
};

export default class BalanceDisplay extends React.PureComponent<Props> {
  render () {
    const { balance, className, label, value, style } = this.props;

    return balance
      ? this.renderProvided()
      : (
        <RxBalance
          className={classes('ui--Balance', className)}
          label={label}
          params={value}
          style={style}
        />
      );
  }

  private renderProvided () {
    const { balance, className, label, style } = this.props;

    if (!balance) {
      return null;
    }

    let value = `${numberFormat(Array.isArray(balance) ? balance[0] : balance)}`;

    if (Array.isArray(balance)) {
      const totals = balance
        .filter((value, index) =>
          index !== 0
        )
        .map(numberFormat);

      value = `${value}  (${totals.length === 1 ? '+' : ''}${totals.join(', ')})`;
    }

    return (
      <div
        className={classes('ui--Balance', className)}
        style={style}
      >
        {label}{value}
      </div>
    );
  }
}
