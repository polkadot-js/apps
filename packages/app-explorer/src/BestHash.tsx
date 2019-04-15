// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Header } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  label?: string,
  chain_subscribeNewHead?: Header
};

class BestHash extends React.PureComponent<Props> {
  render () {
    const { className, label = '', style, chain_subscribeNewHead } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          chain_subscribeNewHead
            ? chain_subscribeNewHead.hash.toHex()
            : undefined
          }
      </div>
    );
  }
}

export default withCalls<Props>('rpc.chain.subscribeNewHead')(BestHash);
