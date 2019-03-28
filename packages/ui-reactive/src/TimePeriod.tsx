// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Moment } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/ui-util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: string,
  timestamp_minimumPeriod?: Moment
};

class TimePeriod extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, timestamp_minimumPeriod } = this.props;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          timestamp_minimumPeriod
            ? `${formatNumber(timestamp_minimumPeriod.toNumber() * 2)}s`
            : '-'
          }{children}
      </div>
    );
  }
}

export default withCall('query.timestamp.blockPeriod')(TimePeriod);
