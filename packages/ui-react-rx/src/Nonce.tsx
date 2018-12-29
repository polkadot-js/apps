// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { Index } from '@polkadot/types';

import { numberFormat } from './util/index';
import { withApiPromise } from './with/index';

type Props = BareProps & {
  label?: string,
  query_system_accountNonce: Index
};

class Nonce extends React.PureComponent<Props> {
  render () {
    const { className, label = '', style, query_system_accountNonce } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          query_system_accountNonce
            ? numberFormat(query_system_accountNonce)
            : '0'
          }
      </div>
    );
  }
}

export default withApiPromise('query.system.accountNonce')(Nonce);
