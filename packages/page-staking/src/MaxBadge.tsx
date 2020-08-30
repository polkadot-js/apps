// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Badge } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

interface Props {
  numNominators?: number;
}

function MaxBadge ({ numNominators }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();

  const max = api.consts.staking?.maxNominatorRewardedPerValidator;

  if (!numNominators || !max || max.gten(numNominators)) {
    return null;
  }

  return (
    <Badge
      color='red'
      info={max.toString()}
    />
  );
}

export default React.memo(MaxBadge);
