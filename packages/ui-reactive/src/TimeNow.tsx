/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/react-query authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Moment } from '@polkadot/types/interfaces';
import { BareProps, CallProps } from '@polkadot/react-api/types';

import React from 'react';
import { withCalls } from '@polkadot/react-api';

import Elapsed from './Elapsed';

type Props = BareProps & CallProps & {
  children?: React.ReactNode;
  label?: React.ReactNode;
  timestamp_now?: Moment;
};

export class TimeNow extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { children, className, isSubstrateV2, label = '', style, timestamp_now } = this.props;
    const value = isSubstrateV2 || !timestamp_now
      ? timestamp_now
      : timestamp_now.muln(1000); // for 1.x, timestamps are in seconds

    return (
      <div
        className={className}
        style={style}
      >
        {label}
        <Elapsed value={value} />
        {children}
      </div>
    );
  }
}

export default withCalls<Props>('query.timestamp.now')(TimeNow);
