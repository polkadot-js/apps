// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { Moment } from '@polkadot/types';
import { withCall } from '@polkadot/ui-api/index';

import Elapsed from './Elapsed';

type Props = BareProps & CallProps & {
  query_timestamp_now?: Moment
};

export default withCall('query.timestamp.now')(
class TimeNow extends React.PureComponent<Props> {
  render (): React.ReactNode {
    const { className, style, query_timestamp_now } = this.props;

    return (
      <Elapsed
        className={className}
        style={style}
        value={query_timestamp_now}
      />
    );
  }
}
);
