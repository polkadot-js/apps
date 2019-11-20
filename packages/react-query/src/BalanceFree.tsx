/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';
import { DerivedBalances } from '@polkadot/api-derive/types';
import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';

import React from 'react';
import { withCalls } from '@polkadot/react-api';

import FormatBalance from './FormatBalance';

interface Props extends BareProps, CallProps {
  balances_all?: DerivedBalances;
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null;
}

function BalanceFree ({ balances_all, children, className, label }: Props): React.ReactElement<Props> {
  return (
    <FormatBalance
      className={className}
      label={label}
      value={balances_all?.freeBalance}
    >
      {children}
    </FormatBalance>
  );
}

export default withCalls<Props>(
  ['derive.balances.all', { paramName: 'params' }]
)(BalanceFree);
