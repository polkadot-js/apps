// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Index } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';

import { numberFormat } from './util/index';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  params?: any | Array<any>,
  query_system_accountNonce?: Index
};

export default withCall('query.system.accountNonce')(
class Nonce extends React.PureComponent<Props> {
  render (): React.ReactNode {
    const { children, className, label = '', style, query_system_accountNonce } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          query_system_accountNonce
            ? numberFormat(query_system_accountNonce)
            : '0'
          }{children}
      </div>
    );
  }
}
);
