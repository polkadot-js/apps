// Copyright 2017-2022 @polkadot/app-nfts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import Collections from '../Collections';
import Summary from '../Summary';

import type { BN } from '@polkadot/util';
import useCollectionIds from '../useCollectionIds';

interface Props {
  className?: string;
  ids?: BN[];
}

const MyCollections = ({ className }: Props): React.ReactElement<Props> => {
  const ids = useCollectionIds(true);

  return (
    <div className={className}>
      <Summary numCollections={ids?.length} />
      <Collections ids={ids} />
    </div>
  );
};

export default React.memo(MyCollections);
