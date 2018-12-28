// Copyright 2017-2018 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';

import { withApiPromise } from './with/index';

type Props = BareProps & {
  children?: React.ReactNode,
  value?: string
};

class Chain extends React.PureComponent<Props> {
  render () {
    const { children, className, style, value = '' } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {children}{value.toString()}
      </div>
    );
  }
}

export default withApiPromise('rpc.system.chain', {})(Chain);
