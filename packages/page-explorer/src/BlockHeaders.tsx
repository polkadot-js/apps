// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { HeaderExtended } from '@polkadot/api-derive';

import BlockHeader from './BlockHeader';

interface Props {
  headers: HeaderExtended[];
}

function BlockHeaders ({ headers }: Props): React.ReactElement<Props> {
  return (
    <>
      {headers.map((header, index): React.ReactNode => (
        <BlockHeader
          isSummary={!!index}
          key={header.number.toString()}
          value={header}
          withLink={!header.number.isEmpty}
        />
      ))}
    </>
  );
}

export default React.memo(BlockHeaders);
