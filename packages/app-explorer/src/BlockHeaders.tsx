// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CallProps } from '@polkadot/ui-api/types';

import React from 'react';
import { HeaderExtended } from '@polkadot/api-derive';
import { withCalls } from '@polkadot/ui-api';

import BlockHeader from './BlockHeader';

export const MAX_ITEMS = 15;

let blockHeaders: HeaderExtended[] = [];

const transform = (header: HeaderExtended): HeaderExtended[] => {
  if (!header) {
    return blockHeaders;
  }

  blockHeaders = blockHeaders
    .filter((old, index): boolean =>
      index < MAX_ITEMS && old.blockNumber.lt(header.blockNumber)
    )
    .reduce((next, header): HeaderExtended[] => {
      next.push(header);

      return next;
    }, [header])
    .sort((a, b): number =>
      b.blockNumber.cmp(a.blockNumber)
    );

  return blockHeaders;
};

interface Props extends CallProps {
  headers?: HeaderExtended[];
}

class BlockHeaders extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { headers = [] } = this.props;

    return headers.map((header, index): React.ReactNode => (
      <BlockHeader
        isSummary={!!index}
        key={header.blockNumber.toString()}
        value={header}
        withLink={!header.blockNumber.isZero()}
      />
    ));
  }
}

export default withCalls<Props>(['derive.chain.subscribeNewHead', {
  propName: 'headers',
  transform
}])(BlockHeaders);
