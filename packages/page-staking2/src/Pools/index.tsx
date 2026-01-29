// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { OwnPool } from './types.js';

import React from 'react';

import Pools from './Pools.js';
import Summary from './Summary.js';
import useOwnPools from './useOwnPools.js';
import useParams from './useParams.js';
import usePoolIds from './usePoolIds.js';

interface Props {
  className?: string;
  ownPools?: OwnPool[];
}

function NominationPools ({ className, ownPools: ownPoolProp }: Props): React.ReactElement<Props> {
  const ids = usePoolIds();
  const ownPools = useOwnPools();
  const params = useParams();

  return (
    <div className={className}>
      <Summary
        params={params}
        poolCount={ids?.length}
      />
      <Pools
        ids={ids}
        ownPools={ownPools || ownPoolProp}
        params={params}
      />
    </div>
  );
}

export default React.memo(NominationPools);
