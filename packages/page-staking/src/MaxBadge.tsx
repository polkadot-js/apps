// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Badge } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';

import { MAX_NOM_PAYOUTS } from './constants';

interface Props {
  numNominators?: number;
}

function MaxBadge ({ numNominators }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();

  const max = (api.consts.staking?.maxNominatorRewardedPerValidator || MAX_NOM_PAYOUTS);

  if (!numNominators || max.gten(numNominators)) {
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
