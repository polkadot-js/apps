// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { NominatedByMap, SortedTargets } from '../types';

import React, { useEffect, useMemo, useRef, useState } from 'react';

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
  nominatedBy?: NominatedByMap;
  ownStashes?: StakerState[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  toggleLedger?: () => void;
  toggleNominatedBy: () => void;
}

function Overview ({ className = '', favorites, hasAccounts, hasQueries, nominatedBy, ownStashes, stakingOverview, targets, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [typeIndex, setTypeIndex] = useState(1);
  const recentlyOnline = useCall<DeriveHeartbeats>(api.derive.imOnline?.receivedHeartbeats);

  const filterOptions = useRef([
    { text: t('Own validators'), value: 'mine' },
    { text: t('All validators'), value: 'all' }
  ]);

  const ownStashIds = useMemo(
    () => ownStashes && ownStashes.map(({ stashId }) => stashId),
    [ownStashes]
  );

  useEffect((): void => {
    toggleNominatedBy && toggleNominatedBy();
  }, [toggleNominatedBy]);

  useEffect((): void => {
    toggleLedger && toggleLedger();
  }, [toggleLedger]);

  const isOwn = typeIndex === 0;

  return (
    <div className={`staking--Overview ${className}`}>
      <Summary
        eraValidators={targets.eraValidators}
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
      </Button.Group>
      <CurrentList
        favorites={favorites}
        hasQueries={hasQueries}
        isOwn={isOwn}
        key={0}
        nominatedBy={nominatedBy}
        ownStashIds={ownStashIds}
        recentlyOnline={recentlyOnline}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </div>
  );
}

export default React.memo(Overview);
