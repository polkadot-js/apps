// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps, BareProps } from '@polkadot/ui-api/types';

import React from 'react';
import { BlockNumber } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';

import { numberFormat } from './util/index';

type Props = ApiProps & BareProps & {
  children?: React.ReactNode,
  label?: string,
  derive_chain_bestNumberFinalised?: BlockNumber
};

@withCall('derive.chain.bestNumberFinalised')
export default class BestFinalised extends React.PureComponent<Props> {
  render (): React.ReactNode {
    const { children, className, label = '', style, derive_chain_bestNumberFinalised } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          derive_chain_bestNumberFinalised
            ? numberFormat(derive_chain_bestNumberFinalised)
            : '-'
          }{children}
      </div>
    );
  }
}
