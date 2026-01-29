// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { NominatedByMap, SortedTargets } from '@polkadot/app-staking/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ToggleGroup } from '@polkadot/react-components';
import { useApi, useBlockAuthors, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import ActionsBanner from './ActionsBanner.js';
import CurrentList from './CurrentList.js';
import StakingAsyncOverview from './StakingAsyncOverview.js';
import Summary from './Summary.js';

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

const EMPTY_PARA_VALS: Record<string, boolean> = {};
const EMPTY_BY_AUTHOR: Record<string, string> = {};
const EMPTY_ERA_POINTS: Record<string, string> = {};

function Overview ({ className = '', favorites, hasAccounts, hasQueries, minCommission, nominatedBy, ownStashes, paraValidators, stakingOverview, targets, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useBlockAuthors();
  const [intentIndex, _setIntentIndex] = useState(0);
  const [typeIndex, setTypeIndex] = useState(1);
  const recentlyOnline = useCall<DeriveHeartbeats>(api.derive.imOnline?.receivedHeartbeats);

  const setIntentIndex = useCallback(
    (index: number): void => {
      index && toggleNominatedBy();
      _setIntentIndex(index);
    },
    [toggleNominatedBy]
  );

  const filterOptions = useRef([
    { text: t('Own validators'), value: 'mine' },
    { text: t('All validators'), value: 'all' }
  ]);

  const intentOptions = useRef([
    { text: t('Active'), value: 'active' },
    { text: t('Waiting'), value: 'waiting' }
  ]);

  const ownStashIds = useMemo(
    () => ownStashes?.map(({ stashId }) => stashId),
    [ownStashes]
  );

  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  const isOwn = typeIndex === 0;

  return (
    <div className={`${className} staking--Overview`}>
      <StakingAsyncOverview withIcon />
      <Summary
        stakingOverview={stakingOverview}
        targets={targets}
      />
      {hasAccounts && (ownStashes?.length === 0) && (
        <ActionsBanner />
      )}
      <Button.Group>
        <ToggleGroup
          onChange={setTypeIndex}
          options={filterOptions.current}
          value={typeIndex}
        />
        <ToggleGroup
          onChange={setIntentIndex}
          options={intentOptions.current}
          value={intentIndex}
        />
      </Button.Group>
      <CurrentList
        byAuthor={intentIndex === 0 ? byAuthor : EMPTY_BY_AUTHOR}
        eraPoints={intentIndex === 0 ? eraPoints : EMPTY_ERA_POINTS}
        favorites={favorites}
        hasQueries={hasQueries}
        isIntentions={intentIndex === 1}
        isOwn={isOwn}
        key={intentIndex}
        minCommission={intentIndex === 0 ? minCommission : undefined}
        nominatedBy={intentIndex === 1 ? nominatedBy : undefined}
        ownStashIds={ownStashIds}
        paraValidators={(intentIndex === 0 && paraValidators) || EMPTY_PARA_VALS}
        recentlyOnline={intentIndex === 0 ? recentlyOnline : undefined}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Overview);
