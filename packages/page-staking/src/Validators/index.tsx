// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets } from '../types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Button, ToggleGroup } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import ActionsBanner from './ActionsBanner';
import CurrentList from './CurrentList';
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

function Overview ({ className = '', favorites, hasAccounts, hasQueries, minCommission, nominatedBy, ownStashes, paraValidators, stakingOverview, targets, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
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
    () => ownStashes && ownStashes.map(({ stashId }) => stashId),
    [ownStashes]
  );

  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  const isOwn = typeIndex === 0;

  return (
    <div className={`staking--Overview ${className}`}>
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
        favorites={favorites}
        hasQueries={hasQueries}
        isIntentions={intentIndex === 1}
        isOwn={isOwn}
        key={intentIndex}
        minCommission={intentIndex === 0 ? minCommission : undefined}
        nominatedBy={intentIndex === 1 ? nominatedBy : undefined}
        ownStashIds={ownStashIds}
        paraValidators={paraValidators}
        recentlyOnline={intentIndex === 0 ? recentlyOnline : undefined}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Overview);
