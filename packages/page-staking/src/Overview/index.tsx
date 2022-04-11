// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { Button, ToggleGroup } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import CurrentList from './CurrentList';

interface Props {
  className?: string;
  favorites: string[];
  hasQueries: boolean;
  minCommission?: BN;
  nominatedBy?: NominatedByMap;
  paraValidators?: Record<string, boolean>;
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  toggleLedger?: () => void;
  toggleNominatedBy: () => void;
}

function Overview ({ className = '', favorites, hasQueries, minCommission, nominatedBy, paraValidators, stakingOverview, targets, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [intentIndex, _setIntentIndex] = useState(0);
  const [typeIndex, setTypeIndex] = useState(1);

  const setIntentIndex = useCallback(
    (index: number): void => {
      index && toggleNominatedBy();
      _setIntentIndex(index);
    },
    [toggleNominatedBy]
  );

  const filterOptions = useMemo(
    () => [
      { isDisabled: true, text: t('My validators'), value: 'mine' },
      { text: t('All validators'), value: 'all' }
    ],
    [t]
  );

  const intentOptions = useMemo(
    () => [
      { text: t('Active'), value: 'active' },
      { text: t('Waiting'), value: 'waiting' }
    ],
    [t]
  );

  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  return (
    <div className={`staking--Overview ${className}`}>
      <Button.Group>
        <ToggleGroup
          onChange={setTypeIndex}
          options={filterOptions}
          value={typeIndex}
        />
        <ToggleGroup
          onChange={setIntentIndex}
          options={intentOptions}
          value={intentIndex}
        />
      </Button.Group>
      <CurrentList
        className={intentIndex === 0 ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={hasQueries}
        minCommission={minCommission}
        paraValidators={paraValidators}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
      <CurrentList
        className={intentIndex === 1 ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={hasQueries}
        isIntentions
        nominatedBy={nominatedBy}
        paraValidators={paraValidators}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Overview);
