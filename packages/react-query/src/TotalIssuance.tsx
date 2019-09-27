/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';
import { Balance } from '@polkadot/types/interfaces';

import React from 'react';
import { withCalls } from '@polkadot/react-api';
import { formatBalance } from '@polkadot/util';

interface Props extends BareProps, CallProps {
  children?: React.ReactNode;
  label?: React.ReactNode;
  balances_totalIssuance?: Balance;
}

export function TotalIssuance ({ children, className, label = '', style, balances_totalIssuance }: Props): React.ReactElement<Props> {
  const value = balances_totalIssuance
    ? balances_totalIssuance.toString()
    : null;

  return (
    <div
      className={className}
      style={style}
    >
      {label}{
        value
          ? `${formatBalance(value, false)}${formatBalance.calcSi(value).value}`
          : '-'
      }{children}
    </div>
  );
}

export default withCalls<Props>('query.balances.totalIssuance')(TotalIssuance);
