// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { BlockNumber } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/ui-util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  chain_bestNumberFinalised?: BlockNumber
};

class BestFinalised extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, chain_bestNumberFinalised } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          chain_bestNumberFinalised
            ? formatNumber(chain_bestNumberFinalised)
            : '-'
          }{children}
      </div>
    );
  }
}

export default withCall('derive.chain.bestNumberFinalised')(BestFinalised);
