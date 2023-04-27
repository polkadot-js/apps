// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { NominatedByMap, SortedTargets } from '../types.js';

import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Button, ToggleGroup } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate.js';
import ActionsBanner from './ActionsBanner.js';
import CurrentList from './CurrentList.js';
import Summary from './Summary.js';

interface Props {
  className?: string;
  favorites: string[];
  hasAccounts: boolean;
  hasQueries: boolean;
  nominatedBy?: NominatedByMap;
  ownStashes?: StakerState[];
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  toggleLedger?: () => void;
  toggleNominatedBy: () => void;
}

function Overview ({ className = '', favorites, hasAccounts, hasQueries, nominatedBy, ownStashes, targets, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [typeIndex, setTypeIndex] = useState(1);
  const recentlyOnline = useCall<DeriveHeartbeats>(api.derive.imOnline?.receivedHeartbeats);

  const filterOptions = useRef([
    { text: t<string>('Own validators'), value: 'mine' },
    { text: t<string>('All validators'), value: 'all' }
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
    <div className={`${className} staking--Overview`}>
      <Summary
        eraValidators={targets.eraValidators}
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
