// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets } from '../types';

import React, { useEffect } from 'react';

import Summary from './Summary';

interface Props {
  className?: string;
  favorites: string[];
  hasAccounts: boolean;
  hasQueries: boolean;
  minCommission?: BN;
  nominatedBy?: NominatedByMap;
  ownStashes?: StakerState[];
  paraValidators?: Record<string, boolean>;
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  toggleLedger?: () => void;
  toggleNominatedBy: () => void;
}

function Overview ({ className = '', stakingOverview, targets, toggleLedger }: Props): React.ReactElement<Props> {
  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  return (
    <div className={`staking--Overview ${className}`}>
      <Summary
        stakingOverview={stakingOverview}
        targets={targets}
      />
    </div>
  );
}

export default React.memo(Overview);
