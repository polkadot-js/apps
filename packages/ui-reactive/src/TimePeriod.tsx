/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Moment } from '@polkadot/types/interfaces';
import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { withCalls } from '@polkadot/ui-api';
import { formatNumber } from '@polkadot/util';

type Props = BareProps & CallProps & {
  children?: React.ReactNode;
  label?: React.ReactNode;
  timestamp_minimumPeriod?: Moment;
}

export class TimePeriod extends React.PureComponent<Props> {
  public render (): React.ReactNode {
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

export default withCalls<Props>(
  // substrate 1.x: 'query.timestamp.blockPeriod'
  ['consts.timestamp.minimumPeriod', { fallbacks: ['query.timestamp.minimumPeriod'] }]
)(TimePeriod);
