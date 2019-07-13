// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalances } from '@polkadot/api-derive/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { formatNumber } from '@polkadot/util';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  accountNonce?: BN;
  callOnResult?: (accountNonce: BN) => void;
  children?: React.ReactNode;
  label?: React.ReactNode;
  params?: string;
};

export class Nonce extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { accountNonce, children, className, label = '' } = this.props;

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
}

export default withCalls<Props>(
  ['derive.balances.all', {
    paramName: 'params',
    propName: 'accountNonce',
    transform: ({ accountNonce }: DerivedBalances): BN =>
      accountNonce
  }]
)(Nonce);
