// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useMemo, useRef, useState } from 'react';

import { Table, Toggle } from '@polkadot/react-components';
import { useLenientThresholdPercentage, useNextTick } from '@polkadot/react-hooks';

import Filtering from '../Filtering.js';
import { useTranslation } from '../translate.js';
import Address from './Address/index.js';
import { EraValidatorPerformance } from './Performance.js';

interface Props {
  className?: string;
  eraValidatorPerformances: EraValidatorPerformance[];
  expectedBlockCount?: number;
  onlyCommittee: boolean;
}

function getFiltered (displayOnlyCommittee: boolean, eraValidatorPerformances: EraValidatorPerformance[]) {
  const validators = displayOnlyCommittee ? eraValidatorPerformances.filter((performance) => performance.isCommittee) : eraValidatorPerformances;

  return validators;
}

export function calculatePercentReward (blocksCreated: number | undefined, blocksTargetValue: number | undefined, lenientThresholdPercentage: number | undefined, isCommittee: boolean) {
  if (blocksCreated === undefined || blocksTargetValue === undefined || lenientThresholdPercentage === undefined) {
    return '';
  }

  let rewardPercentage = 0;

  if (!isCommittee) {
    rewardPercentage = 100;
  } else if (blocksTargetValue > 0) {
    rewardPercentage = 100 * blocksCreated / blocksTargetValue;

    if (rewardPercentage >= lenientThresholdPercentage) {
      rewardPercentage = 100;
    }
  }

  return rewardPercentage.toFixed(1);
}

function CurrentList ({ className, eraValidatorPerformances, expectedBlockCount, onlyCommittee }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const [nameFilter, setNameFilter] = useState<string>('');
  const [displayOnlyCommittee, setDisplayOnlyCommittee] = useState(true);

  const lenientThresholdPercentage = useLenientThresholdPercentage();

  const isNextTick = useNextTick();

  const validators = useMemo(
    () => getFiltered(displayOnlyCommittee, eraValidatorPerformances),
    [eraValidatorPerformances, displayOnlyCommittee]
  );

  const list = useMemo(
    () => isNextTick
      ? validators
      : [],
    [isNextTick, validators]
  );

  const headerRef = useRef<[string, string, number?][]>(
    [
      [t<string>('validators'), 'start', 1],
      [t<string>('blocks created'), 'expand'],
      [t<string>('max % reward'), 'expand'],
      [t<string>('stats'), 'expand']
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
          {!onlyCommittee && (
            <Toggle
              className='staking--buttonToggle'
              label={
                t<string>('Current committee')
              }
              onChange={setDisplayOnlyCommittee}
              value={displayOnlyCommittee}
            />
          )}
        </div>
      }
      header={headerRef.current}
    >
      {list.map(({ isCommittee, validatorPerformance }): React.ReactNode => (
        <Address
          address={validatorPerformance.accountId}
          blocksCreated={validatorPerformance.blockCount}
          filterName={nameFilter}
          key={validatorPerformance.accountId}
          rewardPercentage={calculatePercentReward(validatorPerformance.blockCount, expectedBlockCount, lenientThresholdPercentage, isCommittee)}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
