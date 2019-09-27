// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { formatBalance } from '@polkadot/util';
import { Balance } from '@polkadot/react-query';

import { classes } from './util';

export interface Props extends BareProps {
  balance?: BN | BN[];
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
  withLabel?: boolean;
}

function renderProvided ({ balance, className, label, style }: Props): React.ReactNode {
  let value = `${formatBalance(Array.isArray(balance) ? balance[0] : balance)}`;

  if (Array.isArray(balance)) {
    const totals = balance.filter((_, index): boolean => index !== 0);
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

export default function BalanceDisplay (props: Props): React.ReactElement<Props> | null {
  const { balance, className, label, params, style } = props;

  if (!params) {
    return null;
  }

  return balance
    ? (
      <>
        {renderProvided(props)}
      </>
    )
    : (
      <Balance
        className={classes('ui--Balance', className)}
        label={label}
        params={params}
        style={style}
      />
    );
}
