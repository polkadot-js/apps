/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Header } from '@polkadot/types/interfaces';
import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { withCalls } from '@polkadot/react-api';

type Props = BareProps & CallProps & {
  label?: string;
  chain_subscribeNewHeads?: Header;
};

class BestHash extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, label = '', style, chain_subscribeNewHeads } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          chain_subscribeNewHeads
            ? chain_subscribeNewHeads.hash.toHex()
            : undefined
        }
      </div>
    );
  }
}

export default withCalls<Props>('rpc.chain.subscribeNewHeads')(BestHash);
