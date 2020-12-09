// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { SortedTargets } from '../types';

import React from 'react';

import CurrentList from './CurrentList';

interface Props {
  className?: string;
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

function Overview ({ className = '', favorites, hasQueries, isIntentions, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  return (
    <div className={`staking--Overview ${className}`}>
      <CurrentList
        favorites={favorites}
        hasQueries={hasQueries}
        isIntentions={isIntentions}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Overview);
