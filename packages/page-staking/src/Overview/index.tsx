// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import { BareProps } from '@polkadot/react-components/types';

import React from 'react';

import CurrentList from './CurrentList';

interface Props extends BareProps {
  hasQueries: boolean;
  isIntentions?: boolean;
  next?: string[];
  setNominators?: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
}

function Overview ({ className, hasQueries, isIntentions, next, setNominators, stakingOverview }: Props): React.ReactElement<Props> {
  return (
    <div className={`staking--Overview ${className}`}>
      <CurrentList
        hasQueries={hasQueries}
        isIntentions={isIntentions}
        next={next}
        setNominators={setNominators}
        stakingOverview={stakingOverview}
      />
    </div>
  );
}

export default React.memo(Overview);
