// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';

import { EraValidatorPerformance } from '@polkadot/app-staking/Performance/Performance';
import { Table, Toggle } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  className?: string;
  session: number;
  eraValidatorPerformances: EraValidatorPerformance[];
}

function getFiltered (displayOnlyCommittee: boolean, eraValidatorPerformances: EraValidatorPerformance[]) {
  const validators = displayOnlyCommittee ? eraValidatorPerformances.filter((performance) => performance.isCommittee) : eraValidatorPerformances;

  return validators;
}

export function calculatePercentReward (blocksCreated: number | undefined, blocksTargetValue: number) {
  if (blocksCreated === undefined) {
    return '';
  }

  let rewardPercentage = 0;

  if (blocksTargetValue > 0) {
    rewardPercentage = 100 * blocksCreated / blocksTargetValue;
    if (rewardPercentage >= 90 || rewardPercentage > 100) {
      rewardPercentage = 100;
    }
  } else if (blocksTargetValue === 0 && blocksCreated === 0) {
    rewardPercentage = 100;
  }

  return rewardPercentage.toFixed(1);
}

function CurrentList ({ className, eraValidatorPerformances }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');
  const [displayOnlyCommittee, setDisplayOnlyCommittee] = useState(true);

  const isLoading = useLoadingDelay();

  const validators = useMemo(
    () => getFiltered(displayOnlyCommittee, eraValidatorPerformances),
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
      [t('validators'), 'start', 1],
      [t('blocks created'), 'expand'],
      [t('blocks expected'), 'expand'],
      [t('max % reward'), 'expand'],
      [t('stats'), 'expand']
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
      {list.map(({ validatorPerformance }): React.ReactNode => (
        <Address
          address={validatorPerformance.accountId}
          blocksCreated={validatorPerformance.blockCount}
          blocksTarget={validatorPerformance.expectedBlockCount}
          filterName={nameFilter}
          key={validatorPerformance.accountId}
          rewardPercentage={calculatePercentReward(validatorPerformance.blockCount, validatorPerformance.expectedBlockCount)}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
