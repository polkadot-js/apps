// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { Header } from '@polkadot/types';

import { numberFormat } from './util/index';
import { withApiPromise } from './with/index';

type Props = BareProps & {
  children?: React.ReactNode,
  label?: string,
  rpc_chain_subscribeNewHead?: Header
};

class BestNumber extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, rpc_chain_subscribeNewHead } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          rpc_chain_subscribeNewHead && rpc_chain_subscribeNewHead.blockNumber
            ? numberFormat(rpc_chain_subscribeNewHead.blockNumber)
            : 'unknown'
          }{children}
      </div>
    );
  }
}

export default withApiPromise('rpc.chain.subscribeNewHead')(BestNumber);
