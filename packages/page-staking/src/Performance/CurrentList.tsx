// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';

import { ValidatorPerformance } from '@polkadot/app-staking/Performance/Performance';
import { Table, Toggle } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  className?: string;
  toggleFavorite: (address: string) => void;
  session: number;
  validatorPerformances: ValidatorPerformance[];
}

function sortValidatorsByFavourites (validatorPerformances: ValidatorPerformance[]): ValidatorPerformance[] {
  return validatorPerformances
    .sort(({ isFavourite: favA }: ValidatorPerformance, { isFavourite: favB }: ValidatorPerformance): number => {
      return favA === favB ? 0 : (favA ? -1 : 1);
    });
}

function getFiltered (displayOnlyCommittee: boolean, validatorPerformances: ValidatorPerformance[]) {
  const validators = displayOnlyCommittee ? validatorPerformances.filter((performance) => performance.isCommittee) : validatorPerformances;

  return sortValidatorsByFavourites(validators);
}

function CurrentList ({ className, toggleFavorite, validatorPerformances }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');
  const [displayOnlyCommittee, setDisplayOnlyCommittee] = useState(true);

  const isLoading = useLoadingDelay();

  const validators = useMemo(
    () => getFiltered(displayOnlyCommittee, validatorPerformances),
    [validatorPerformances, displayOnlyCommittee]
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

  function calculatePercentReward (blocksCreated: number, blocksTargetValue: number) {
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
      {list.map((performance): React.ReactNode => (
        <Address
          address={performance.accountId}
          blocksCreated={performance.blockCount}
          blocksTarget={performance.expectedBlockCount}
          filterName={nameFilter}
          isFavorite={performance.isFavourite}
          key={performance.accountId}
          rewardPercentage={calculatePercentReward(performance.blockCount, performance.expectedBlockCount).toFixed(1)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
