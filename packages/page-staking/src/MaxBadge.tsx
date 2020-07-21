// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React from 'react';
import { Badge } from '@polkadot/react-components';

import { MAX_PAYOUTS } from './constants';

interface Props {
  numNominators?: number;
}

function MaxBadge ({ numNominators }: Props): React.ReactElement<Props> | null {
  if (!numNominators || (numNominators < MAX_PAYOUTS)) {
    return null;
  }

  return (
    <Badge
      color='red'
      info='64+'
    />
  );
}

export default React.memo(MaxBadge);
