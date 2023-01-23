// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnPool } from '../types';

import React from 'react';

import Pools from './Pools';
import Summary from './Summary';
import useParams from './useParams';
import usePoolIds from './usePoolIds';

interface Props {
  className?: string;
  ownPools?: OwnPool[];
}

function NominationPools ({ className, ownPools }: Props): React.ReactElement<Props> {
  const ids = usePoolIds();
  const params = useParams();

  return (
    <div className={className}>
      <Summary
        params={params}
        poolCount={ids?.length}
      />
      <Pools
        ids={ids}
        ownPools={ownPools}
        params={params}
      />
    </div>
  );
}

export default React.memo(NominationPools);
