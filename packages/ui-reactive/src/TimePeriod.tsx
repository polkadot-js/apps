// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Moment } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';

import { numberFormat } from './util/index';

type Props = BareProps & {
  children?: React.ReactNode,
  label?: string,
  query_timestamp_blockPeriod?: Moment
};

@withCall('query.timestamp.blockPeriod')
export default class TimePeriod extends React.PureComponent<Props> {
  render (): React.ReactNode {
    const { children, className, label = '', style, query_timestamp_blockPeriod } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          query_timestamp_blockPeriod
            ? `${numberFormat(query_timestamp_blockPeriod.toNumber() * 2)}s`
            : '-'
          }{children}
      </div>
    );
  }
}
