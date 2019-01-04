// Copyright 2017-2019 @polkadot/ui-react-rx authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { Moment } from '@polkadot/types';

import { numberFormat } from './util/index';
import { withCall } from './with/index';

type Props = BareProps & {
  children?: React.ReactNode,
  label?: string,
  query_timestamp_blockPeriod: Moment
};

class TimePeriod extends React.PureComponent<Props> {
  render () {
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

export default withCall('query.timestamp.blockPeriod')(TimePeriod);
