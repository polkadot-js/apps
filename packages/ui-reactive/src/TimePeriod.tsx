/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Moment, Option } from '@polkadot/types';
import { withCalls } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode;
  label?: React.ReactNode;
  timestamp_minimumPeriod?: Moment | Option<Moment>; // Type Option<Moment> for pre 1.0 support
};

export class TimePeriod extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, label = '', style, timestamp_minimumPeriod } = this.props;

    // const period = timestamp_minimumPeriod && timestamp_minimumPeriod as Moment).toNumber
    // ? (timestamp_minimumPeriod as Moment)
    // : (timestamp_minimumPeriod as Option<Moment>).unwrapOr(null);

    const period = timestamp_minimumPeriod
      ? !(timestamp_minimumPeriod as Moment).toNumber
        ? (timestamp_minimumPeriod as Option<Moment>).unwrapOr(null)
        : timestamp_minimumPeriod
      : null;

    console.log('Period', period);

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
  // substrate 1.x: 'query.timestamp.blockPeriod',  pre-substrate 1.x:   'query.timestamp.blockPeriod'
  ['consts.timestamp.minimumPeriod', { fallbacks: ['query.timestamp.minimumPeriod', 'query.timestamp.blockPeriod'] }]
)(TimePeriod);
