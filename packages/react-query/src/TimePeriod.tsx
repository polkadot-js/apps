/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Moment } from '@polkadot/types/interfaces';
import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { withCalls } from '@polkadot/react-api';
import { formatNumber } from '@polkadot/util';

interface Props extends BareProps, CallProps {
  babe_expectedBlockTime?: Moment;
  children?: React.ReactNode;
  label?: React.ReactNode;
  timestamp_minimumPeriod?: Moment;
}

export function TimePeriod ({ babe_expectedBlockTime, children, className, label = '', style, timestamp_minimumPeriod }: Props): React.ReactElement<Props> {
  return (
    <div
      className={className}
      style={style}
    >
      {label}{
        babe_expectedBlockTime
          ? `${formatNumber(babe_expectedBlockTime.toNumber() / 1000)}s`
          : timestamp_minimumPeriod
            ? `${formatNumber(timestamp_minimumPeriod.gtn(1000) ? (timestamp_minimumPeriod.toNumber() / 500) : (timestamp_minimumPeriod.toNumber() * 2))}s`
            : '-'
      }{children}
    </div>
  );
}

// NOTE we are not combining this into one with a fallback, it becomes slightly tricky.
// There must be a cleaner way with this logic, but as of now it works on Alex & Kusama
//  - babe bas the exact value in miliseconds
//  - non-babe on 2.x has the value in miliseconds (not catered for here)
//  - anything non-babe, i.e. Aura, needs to be multiplied by 2
export default withCalls<Props>(
  // substrate 2.x: consts.babe.expectedBlockTime
  'consts.babe.expectedBlockTime',
  // substrate 1.x: 'query.timestamp.blockPeriod'
  ['consts.timestamp.minimumPeriod', {
    fallbacks: ['query.timestamp.minimumPeriod']
  }]
)(TimePeriod);
