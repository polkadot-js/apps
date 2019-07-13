/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { BlockNumber } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode;
  label?: React.ReactNode;
  chain_bestNumberFinalized?: BlockNumber;
};

export class BestFinalized extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, label = '', style, chain_bestNumberFinalized } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          chain_bestNumberFinalized
            ? formatNumber(chain_bestNumberFinalized)
            : '-'
        }{children}
      </div>
    );
  }
}

export default withCalls<Props>('derive.chain.bestNumberFinalized')(BestFinalized);
