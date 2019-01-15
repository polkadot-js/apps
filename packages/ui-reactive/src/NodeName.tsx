// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Text } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  rpc_system_name?: Text
};

export default withCall('rpc.system.name')(
class NodeName extends React.PureComponent<Props> {
  render (): React.ReactNode {
    const { children, className, label = '', style, rpc_system_name = 'unknown' } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{rpc_system_name.toString()}{children}
      </div>
    );
  }
}
);
