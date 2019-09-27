// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { BareProps, CallProps } from '@polkadot/react-api/types';

import BN from 'bn.js';
import React from 'react';
import { formatNumber } from '@polkadot/util';
import { withCalls } from '@polkadot/react-api';

interface Props extends BareProps, CallProps {
  accountNonce?: BN;
  callOnResult?: (accountNonce: BN) => void;
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: string | null;
}

export function Nonce ({ accountNonce, children, className, label = '' }: Props): React.ReactElement<Props> {
  return (
    <div className={className}>
      {label}{
        accountNonce
          ? formatNumber(accountNonce)
          : '0'
      }{children}
    </div>
  );
}

export default withCalls<Props>(
  ['derive.balances.all', {
    paramName: 'params',
    propName: 'accountNonce',
    transform: ({ accountNonce }: DerivedBalances): BN =>
      accountNonce
  }]
)(Nonce);
