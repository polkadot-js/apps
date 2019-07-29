// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { formatBalance } from '@polkadot/util';
import { Balance } from '@polkadot/ui-reactive';

import { classes } from './util';

export interface Props extends BareProps {
  balance?: BN | BN[];
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

export default class BalanceDisplay extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { balance, className, label, params, style } = this.props;

    if (!params) {
      return null;
    }

    return balance
      ? this.renderProvided()
      : (
        <Balance
          className={classes('ui--Balance', className)}
          label={label}
          params={params}
          style={style}
        />
      );
  }

  private renderProvided (): React.ReactNode {
    const { balance, className, label, style } = this.props;
    let value = `${formatBalance(Array.isArray(balance) ? balance[0] : balance)}`;

    if (Array.isArray(balance)) {
      const totals = balance.filter((value, index): boolean => index !== 0);
      const total = totals.reduce((total, value): BN => total.add(value), new BN(0)).gtn(0)
        ? `(+${totals.map((balance): string => formatBalance(balance)).join(', ')})`
        : '';

      value = `${value}  ${total}`;
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
