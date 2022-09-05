// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets, ValidatorInfo } from '../types';

import React, { useMemo, useRef, useState } from 'react';

import { Table, Toggle } from '@polkadot/react-components';
import { useLoadingDelay } from '@polkadot/react-hooks';
import { AccountId } from '@polkadot/types/interfaces';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  className?: string;
  favorites: string[];
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  session: number;
  eraValidators: AccountId[];
  currentSessionCommittee: AccountId[];
  sessionValidatorBlockCountLookup: Record<string, number>;
  expectedSessionValidatorBlockCount: Record<string, number>;
}

type AccountExtend = [string, boolean];

interface Filtered {
  validators?: AccountExtend[];
}

function sortAccountByFavourites (accounts: string[], favorites: string[]): AccountExtend[] {
  return accounts
    .map((accountId): AccountExtend => [
      accountId,
      favorites.includes(accountId)
    ])
    .sort(([, isFavA]: AccountExtend, [, isFavB]: AccountExtend): number => {
      return isFavA === isFavB ? 0 : (isFavA ? -1 : 1);
    });
}

function getFiltered (targets: SortedTargets | undefined, favorites: string[], allEraValidators: boolean, currentSessionCommittee: AccountId[], eraValidators: AccountId[]): Filtered {
  if (!targets) {
    return {};
  }

  const validators = allEraValidators ? eraValidators : currentSessionCommittee;

  return {
    validators: sortAccountByFavourites(validators.map((accountId) => accountId.toString()), favorites)
  };
}

function mapValidators (infos: ValidatorInfo[]): Record<string, ValidatorInfo> {
  const result: Record<string, ValidatorInfo> = {};

  for (let i = 0; i < infos.length; i++) {
    const info = infos[i];

    result[info.key] = info;
  }

  return result;
}

function CurrentList ({ className, currentSessionCommittee, eraValidators, expectedSessionValidatorBlockCount, favorites, sessionValidatorBlockCountLookup, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');
  const [allEraValidators, setAllEraValidators] = useState(true);

  const isLoading = useLoadingDelay();

  const { validators } = useMemo(
    () => getFiltered(targets, favorites, allEraValidators, currentSessionCommittee, eraValidators),
    [favorites, targets, currentSessionCommittee, allEraValidators, eraValidators]
  );

  const list = useMemo(
    () => isLoading
      ? undefined
      : validators,
    [isLoading, validators]
  );

  const infoMap = useMemo(
    () => targets.validators && mapValidators(targets.validators),
    [targets]
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

  const listExtended: [string, boolean, number, number, number][] | undefined = list?.map(([address, isFavorite]) => {
    const blocksCreated = sessionValidatorBlockCountLookup
      ? Object.keys(sessionValidatorBlockCountLookup).includes(address)
        ? sessionValidatorBlockCountLookup[address]
        : 0
      : 0;
    const blocksTargetValue = expectedSessionValidatorBlockCount[address] || 0;
    let rewardPercentage = 0;

    if (blocksTargetValue > 0) {
      rewardPercentage = 100 * blocksCreated / blocksTargetValue;
    } else if (blocksTargetValue === 0 && blocksCreated === 0) {
      rewardPercentage = 100;
    }

    if (rewardPercentage >= 90) {
      rewardPercentage = 100;
    }

    return [address, isFavorite, blocksCreated, blocksTargetValue, rewardPercentage];
  });

  return (
    <Table
      className={className}
      empty={
        list && infoMap && t<string>('No active validators found')
      }
      emptySpinner={
        <>
          {!validators && <div>{t<string>('Retrieving validators')}</div>}
          {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
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
              t<string>('All era validators')
            }
            onChange={setAllEraValidators}
            value={allEraValidators}
          />
        </div>
      }
      header={headerRef.current}
    >
      {listExtended && listExtended.map(([address, isFavorite, blocksCreated, blocksTarget, rewardPercentage]): React.ReactNode => (
        <Address
          address={address}
          blocksCreated={blocksCreated}
          blocksTarget={blocksTarget}
          filterName={nameFilter}
          isFavorite={isFavorite}
          key={address}
          rewardPercentage={rewardPercentage.toFixed(1)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
