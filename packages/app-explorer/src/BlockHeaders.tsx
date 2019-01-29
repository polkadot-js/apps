// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { HeaderExtended } from '@polkadot/types/Header';
import { withCall } from '@polkadot/ui-api/index';

import BlockHeader from './BlockHeader';

export const MAX_ITEMS = 15;

let blockHeaders: Array<HeaderExtended> = [];

const transform = (header: HeaderExtended): Array<HeaderExtended> => {
  if (!header) {
    return blockHeaders;
  }

  blockHeaders = blockHeaders
    .filter((old, index) =>
      index < MAX_ITEMS && old.blockNumber.lt(header.blockNumber)
    )
    .reduce((next, header) => {
      next.push(header);

      return next;
    }, [header])
    .sort((a, b) =>
      b.blockNumber.cmp(a.blockNumber)
    );

  return blockHeaders;
};

type Props = CallProps & {
  headers?: Array<HeaderExtended>
};

class BlockHeaders extends React.PureComponent<Props> {
  render () {
    const { headers = [] } = this.props;

    return (
      <div className='explorer--BlockHeaders'>
        {headers.map((header, index) => (
          <BlockHeader
            isSummary={!!index}
            key={header.blockNumber.toString()}
            value={header}
            withLink={!header.blockNumber.isZero()}
          />
        ))}
      </div>
    );
  }
}

export default withCall('derive.chain.subscribeNewHead', { propName: 'headers', transform })(BlockHeaders);
