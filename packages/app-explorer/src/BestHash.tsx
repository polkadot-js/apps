// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-react-rx//types';

import React from 'react';
import { Header } from '@polkadot/types';
import { withApiPromise } from '@polkadot/ui-react-rx/with/index';

type Props = BareProps & {
  label?: string,
  rpc_chain_subscribeNewHead?: Header
};

class BestHash extends React.PureComponent<Props> {
  render () {
    const { className, label = '', style, rpc_chain_subscribeNewHead } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          rpc_chain_subscribeNewHead
            ? rpc_chain_subscribeNewHead.hash.toHex()
            : undefined
          }
      </div>
    );
  }
}

export default withApiPromise('rpc.chain.subscribeNewHead', {})(BestHash);
