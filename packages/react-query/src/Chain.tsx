/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { Text } from '@polkadot/types';
import { withCalls } from '@polkadot/react-api';

type Props = BareProps & CallProps & {
  children?: React.ReactNode;
  label?: React.ReactNode;
  system_chain?: Text;
};

export class Chain extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, label = '', style, system_chain = 'unknown' } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{system_chain.toString()}{children}
      </div>
    );
  }
}

export default withCalls<Props>('rpc.system.chain')(Chain);
