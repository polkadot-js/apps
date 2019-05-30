// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Moment, Option } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode,
  label?: React.ReactNode,
  timestamp_blockPeriod?: Moment | Option<Moment>, // support for previous
  timestamp_minimumPeriod?: Moment // support for new version
};

export class TimePeriod extends React.PureComponent<Props> {
  render () {
    const { children, className, label = '', style, timestamp_blockPeriod, timestamp_minimumPeriod } = this.props;
    const period = timestamp_minimumPeriod || (
      timestamp_blockPeriod
        ? (
          (timestamp_blockPeriod as Moment).toNumber
            ? (timestamp_blockPeriod as Moment)
            : (timestamp_blockPeriod as Option<Moment>).unwrapOr(null)
        )
        : null
    );

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          period
            ? `${formatNumber(period.toNumber() * 2)}s`
            : '-'
        }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  'query.timestamp.blockPeriod',
  'query.timestamp.minimumPeriod'
)(TimePeriod);
