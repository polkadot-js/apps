// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { Text } from '@polkadot/types';

import { withApiPromise } from './with/index';

type Props = BareProps & {
  children?: React.ReactNode,
  label?: string,
  rpc_system_chain?: Text
};

class Chain extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, rpc_system_chain = 'unknown' } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{rpc_system_chain.toString()}{children}
      </div>
    );
  }
}

export default withApiPromise('rpc.system.chain')(Chain);
