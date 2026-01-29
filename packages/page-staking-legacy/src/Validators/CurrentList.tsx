// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets, ValidatorInfo } from '../types.js';

import React, { useMemo, useRef, useState } from 'react';

import Legend from '@polkadot/app-staking2/Legend';
import { Table } from '@polkadot/react-components';
import { useApi, useBlockAuthors, useNextTick } from '@polkadot/react-hooks';

import Filtering from '../Filtering.js';
import { useTranslation } from '../translate.js';
import Address from './Address/index.js';

interface Props {
  className?: string;
  byAuthor: Record<string, string>;
  eraPoints: Record<string, string>;
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  isIntentionsTrigger?: boolean;
  isOwn: boolean;
  minCommission?: BN;
  nominatedBy?: NominatedByMap;
  ownStashIds?: string[];
  paraValidators: Record<string, boolean>;
  recentlyOnline?: DeriveHeartbeats;
  setNominators?: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
}

function filterAccounts (isOwn: boolean, accounts: string[] = [], ownStashIds: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId) =>
      !without.includes(accountId) && (
        !isOwn ||
        ownStashIds.includes(accountId)
      )
    )
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([accA,, isFavA]: AccountExtend, [accB,, isFavB]: AccountExtend): number => {
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

function getFiltered (isOwn: boolean, stakingOverview: DeriveStakingOverview | undefined, favorites: string[], next?: string[], ownStashIds?: string[]): Filtered {
  if (!stakingOverview) {
    return {};
  }

  const allElected = accountsToString(stakingOverview.nextElected);
  const validatorIds = accountsToString(stakingOverview.validators);

  return {
    validators: filterAccounts(isOwn, validatorIds, ownStashIds, allElected, favorites, []),
    waiting: filterAccounts(isOwn, allElected, ownStashIds, allElected, favorites, validatorIds).concat(
      filterAccounts(isOwn, next, ownStashIds, [], favorites, allElected)
    )
  };
}

function mapValidators (infos: ValidatorInfo[]): Record<string, ValidatorInfo> {
  const result: Record<string, ValidatorInfo> = {};

  for (let i = 0, count = infos.length; i < count; i++) {
    const info = infos[i];

    result[info.key] = info;
  }

  return result;
}

const DEFAULT_PARAS = {};

function CurrentList ({ className, favorites, hasQueries, isIntentions, isOwn, minCommission, nominatedBy, ownStashIds, paraValidators = DEFAULT_PARAS, recentlyOnline, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useBlockAuthors();
  const [nameFilter, setNameFilter] = useState<string>('');
  const isNextTick = useNextTick();

  const { validators, waiting } = useMemo(
    () => getFiltered(isOwn, stakingOverview, favorites, targets.waitingIds, ownStashIds),
    [favorites, isOwn, ownStashIds, stakingOverview, targets]
  );

  const list = useMemo(
    () => isNextTick
      ? isIntentions
        ? nominatedBy && waiting
        : validators
      : undefined,
    [isIntentions, isNextTick, nominatedBy, validators, waiting]
  );

  const infoMap = useMemo(
    () => targets.validators && mapValidators(targets.validators),
    [targets]
  );

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>(
    isIntentions
      ? [
        [t('intentions'), 'start', 3],
        [t('nominators'), 'expand'],
        [t('commission'), 'number'],
        []
      ]
      : [
        [t('validators'), 'start', 3],
        [t('other stake'), 'expand'],
        [t('commission')],
        [t('last #')],
        []
      ]
  );

  return (
    <Table
      className={className}
      empty={
        isIntentions
          ? list && t('No waiting validators found')
          : list && recentlyOnline && infoMap && t('No active validators found')
      }
      emptySpinner={
        <>
          {!waiting && <div>{t('Retrieving validators')}</div>}
          {!infoMap && <div>{t('Retrieving validator info')}</div>}
          {isIntentions
            ? !nominatedBy && <div>{t('Retrieving nominators')}</div>
            : !recentlyOnline && <div>{t('Retrieving online status')}</div>
          }
          {!list && <div>{t('Preparing validator list')}</div>}
        </>
      }
      filter={
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
        />
      }
      header={headerRef.current}
      legend={
        <Legend
          isRelay={!isIntentions && !!(api.query.parasShared || api.query.shared)?.activeValidatorIndices}
          minCommission={minCommission}
        />
      }
    >
      {list?.map(([address, isElected, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isElected={isElected}
          isFavorite={isFavorite}
          isMain={!isIntentions}
          isPara={paraValidators[address]}
          key={address}
          lastBlock={byAuthor[address]}
          minCommission={minCommission}
          nominatedBy={nominatedBy?.[address]}
          points={eraPoints[address]}
          recentlyOnline={recentlyOnline?.[address]}
          toggleFavorite={toggleFavorite}
          validatorInfo={infoMap?.[address]}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
