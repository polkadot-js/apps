// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Index } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  system_accountNonce?: Index
};

export class Nonce extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, system_accountNonce } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          system_accountNonce
            ? formatNumber(system_accountNonce)
            : '0'
          }{children}
      </div>
    );
  }
}

export default withCall('query.system.accountNonce', { paramName: 'params' })(Nonce);
