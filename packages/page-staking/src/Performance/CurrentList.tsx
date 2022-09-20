// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';

import { Table, Toggle } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';
import {EraValidatorPerformance} from "@polkadot/app-staking/Performance/Performance";

interface Props {
  className?: string;
  toggleFavorite: (address: string) => void;
  favorites: string[];
  session: number;
  eraValidatorPerformances: EraValidatorPerformance[];
}

interface EraValidatorPerformanceExtended {
  eraValidatorPerformance: EraValidatorPerformance;
  isFavourite: boolean;
}

function sortValidatorsByFavourites (validatorPerformances: EraValidatorPerformanceExtended[]): EraValidatorPerformanceExtended[] {
  return validatorPerformances
    .sort(({ isFavourite: favA }, { isFavourite: favB }): number => {
      return favA === favB ? 0 : (favA ? -1 : 1);
    });
}

function getFiltered (displayOnlyCommittee: boolean, eraValidatorPerformances: EraValidatorPerformance[], favorites: string[]) {
  const validators = displayOnlyCommittee ? eraValidatorPerformances.filter((performance) => performance.isCommittee) : eraValidatorPerformances;

  return sortValidatorsByFavourites(validators.map((validatorPerformance) => {
      return {
        isFavourite: !!favorites.find(([id]) => id === validatorPerformance.validatorPerformance.accountId),
        eraValidatorPerformance: validatorPerformance,
      };
    }
  ));
}

export function calculatePercentReward (blocksCreated: number, blocksTargetValue: number) {
  let rewardPercentage = 0;

  if (blocksTargetValue > 0) {
    rewardPercentage = 100 * blocksCreated / blocksTargetValue;

    if (rewardPercentage >= 90) {
      rewardPercentage = 100;
    }
  } else if (blocksTargetValue === 0 && blocksCreated === 0) {
    rewardPercentage = 100;
  }

  return rewardPercentage;
}

function CurrentList ({ className, toggleFavorite, favorites, eraValidatorPerformances }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');
  const [displayOnlyCommittee, setDisplayOnlyCommittee] = useState(true);

  const isLoading = useLoadingDelay();

  const validators = useMemo(
    () => getFiltered(displayOnlyCommittee, eraValidatorPerformances, favorites),
    [eraValidatorPerformances, displayOnlyCommittee]
  );

  const list = useMemo(
    () => isLoading
      ? []
      : validators,
    [isLoading, validators]
  );

  const headerRef = useRef(
    [
      [t('validators'), 'start', 2],
      [t('blocks created'), 'expand'],
      [t('blocks expected'), 'media--1100'],
      [t('max % reward')],
      [],
      [undefined, 'media--1200']
    ]
  );

  return (
    <Table
      className={className}
      empty={
        list && t<string>('No active validators found')
      }
      emptySpinner={
        <>
          {!validators && <div>{t<string>('Retrieving validators')}</div>}
          {!list && <div>{t<string>('Preparing validator list')}</div>}
        </>
      }
      filter={
        <div className='staking--optionsBar'>
          <Filtering
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
          />
          <Toggle
            className='staking--buttonToggle'
            label={
              t<string>('Current committee')
            }
            onChange={setDisplayOnlyCommittee}
            value={displayOnlyCommittee}
          />
        </div>
      }
      header={headerRef.current}
    >
      {list.map(({eraValidatorPerformance, isFavourite}): React.ReactNode => (
        <Address
          address={eraValidatorPerformance.validatorPerformance.accountId}
          blocksCreated={eraValidatorPerformance.validatorPerformance.blockCount}
          blocksTarget={eraValidatorPerformance.validatorPerformance.expectedBlockCount}
          filterName={nameFilter}
          isFavorite={isFavourite}
          key={eraValidatorPerformance.validatorPerformance.accountId}
          rewardPercentage={calculatePercentReward(eraValidatorPerformance.validatorPerformance.blockCount, eraValidatorPerformance.validatorPerformance.expectedBlockCount).toFixed(1)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
