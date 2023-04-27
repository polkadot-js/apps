// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { NominatedByMap, SortedTargets, ValidatorInfo } from '../types.js';

import React, { useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useNextTick } from '@polkadot/react-hooks';

import Filtering from '../Filtering.js';
import { useTranslation } from '../translate.js';
import Address from './Address/index.js';

interface Props {
  className?: string;
  favorites: string[];
  hasQueries: boolean;
  isIntentionsTrigger?: boolean;
  isOwn: boolean;
  nominatedBy?: NominatedByMap;
  ownStashIds?: string[];
  recentlyOnline?: DeriveHeartbeats;
  setNominators?: (nominators: string[]) => void;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

type AccountExtend = [string, boolean];

interface Filtered {
  validators?: AccountExtend[];
}

function filterAccounts (isOwn: boolean, accounts: string[] = [], ownStashIds: string[] = [], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId) =>
      !without.includes(accountId) && (
        !isOwn ||
        ownStashIds.includes(accountId)
      )
    )
    .map((accountId): AccountExtend => [
      accountId,
      favorites.includes(accountId)
    ])
    .sort(([accA, isFavA]: AccountExtend, [accB, isFavB]: AccountExtend): number => {
      const isStashA = ownStashIds.includes(accA);
      const isStashB = ownStashIds.includes(accB);

      return isFavA === isFavB
        ? isStashA === isStashB
          ? 0
          : (isStashA ? -1 : 1)
        : (isFavA ? -1 : 1);
    });
}

function accountsToString (accounts: AccountId[]): string[] {
  const result = new Array<string>(accounts.length);

  for (let i = 0; i < accounts.length; i++) {
    result[i] = accounts[i].toString();
  }

  return result;
}

function getFiltered (isOwn: boolean, favorites: string[], targets: SortedTargets, ownStashIds?: string[]): Filtered {
  if (!targets.eraValidators) {
    return {};
  }

  const eraValidators = accountsToString(targets.eraValidators.reserved.concat(targets.eraValidators.nonReserved));

  return {
    validators: filterAccounts(isOwn, eraValidators, ownStashIds, favorites, [])
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

function CurrentList ({ className, favorites, hasQueries, isOwn, nominatedBy, ownStashIds, recentlyOnline, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [nameFilter, setNameFilter] = useState<string>('');
  const isNextTick = useNextTick();

  const { validators } = useMemo(
    () => getFiltered(isOwn, favorites, targets, ownStashIds),
    [favorites, isOwn, ownStashIds, targets]
  );

  const list = useMemo(
    () => isNextTick
      ? nominatedBy && validators
      : undefined,
    [isNextTick, nominatedBy, validators]
  );

  const infoMap = useMemo(
    () => targets.validators && mapValidators(targets.validators),
    [targets]
  );

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>(
    [
      [t<string>('validators'), 'start', 2],
      [t<string>('other stake'), 'expand'],
      [t<string>('own stake'), 'media--1100'],
      [t<string>('nominators'), 'expand'],
      [t<string>('commission')],
      [],
      [undefined, 'media--1200']
    ]
  );

  return (
    <Table
      className={className}
      empty={
        list && recentlyOnline && infoMap && t<string>('No active validators found')
      }
      emptySpinner={
        <>
          {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
          {!nominatedBy && <div>{t<string>('Retrieving nominators')}</div>}
          {!list && <div>{t<string>('Preparing validator list')}</div>}
        </>
      }
      filter={
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
        />
      }
      header={headerRef.current}
    >
      {list && list.map(([address, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isFavorite={isFavorite}
          key={address}
          nominatedBy={nominatedBy?.[address]}
          toggleFavorite={toggleFavorite}
          validatorInfo={infoMap?.[address]}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
