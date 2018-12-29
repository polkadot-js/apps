// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { Header } from '@polkadot/types';

import { numberFormat } from './util/index';
import { withApiPromise } from './with/index';

type Props = BareProps & {
  label?: string,
  rpc_chain_subscribeFinalisedHeads?: Header
};

class BestFinalised extends React.PureComponent<Props> {
  render () {
    const { className, label = '', style, rpc_chain_subscribeFinalisedHeads } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          rpc_chain_subscribeFinalisedHeads && rpc_chain_subscribeFinalisedHeads.blockNumber
            ? numberFormat(rpc_chain_subscribeFinalisedHeads.blockNumber)
            : 'unknown'
          }
      </div>
    );
  }
}

export default withApiPromise('rpc.chain.subscribeFinalisedHeads')(BestFinalised);
