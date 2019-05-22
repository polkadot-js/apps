// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';
import { Index } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import { formatNumber } from '@polkadot/util';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  callOnResult?: (accountNonce: BN) => void,
  children?: React.ReactNode,
  label?: string,
  params?: string,
  system_accountNonce?: Index
};

export class Nonce extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', system_accountNonce } = this.props;

    return (
      <>
        <span className={className + ' label-nonce'}>
          {label}
        </span>
        <span className={className + ' result-nonce'}>
          {
            system_accountNonce
              ? formatNumber(system_accountNonce)
              : '0'
          }
        </span>{children}
      </>
    );
  }
}

export default withCalls<Props>(
  ['query.system.accountNonce', { paramName: 'params' }]
)(Nonce);
