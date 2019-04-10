// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Text } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  system_name?: Text
};

export class NodeName extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, system_name = 'unknown' } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{system_name.toString()}{children}
      </div>
    );
  }
}

export default withCall('rpc.system.name')(NodeName);
