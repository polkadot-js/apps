// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { Authors } from '@polkadot/react-query/BlockAuthors';
import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { NominatedByMap, SortedTargets, ValidatorInfo } from '../types';

import React, { useContext, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Table } from '@polkadot/react-components';
import { useApi, useLoadingDelay } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';

import Filtering from '../Filtering';
import Legend from '../Legend';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  className?: string;
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  isIntentionsTrigger?: boolean;
  isOwn: boolean;
  minCommission?: BN;
  nominatedBy?: NominatedByMap;
  ownStashIds?: string[];
  paraValidators?: Record<string, boolean>;
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

const EmptyAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor: {}, eraPoints: {}, lastBlockAuthors: [], lastHeaders: [] });

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

  for (let i = 0; i < infos.length; i++) {
    const info = infos[i];

    result[info.key] = info;
  }

  return result;
}

const DEFAULT_PARAS = {};

function CurrentList ({ className, favorites, hasQueries, isIntentions, isOwn, minCommission, nominatedBy, ownStashIds, paraValidators = DEFAULT_PARAS, recentlyOnline, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useContext(isIntentions ? EmptyAuthorsContext : BlockAuthorsContext);
  const [nameFilter, setNameFilter] = useState<string>('');

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();

  const { validators, waiting } = useMemo(
    () => getFiltered(isOwn, stakingOverview, favorites, targets.waitingIds, ownStashIds),
    [favorites, isOwn, ownStashIds, stakingOverview, targets]
  );

  const list = useMemo(
    () => isLoading
      ? undefined
      : isIntentions
        ? nominatedBy && waiting
        : validators,
    [isIntentions, isLoading, nominatedBy, validators, waiting]
  );

  const infoMap = useMemo(
    () => targets.validators && mapValidators(targets.validators),
    [targets]
  );

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>(
    isIntentions
      ? [
        [t('intentions'), 'start', 4]
      ]
      : [
        [t('validators'), 'start', 4]
      ]
  );

  return (
    <Table
      className={className}
      empty={
        isIntentions
          ? list && t<string>('No waiting validators found')
          : list && recentlyOnline && infoMap && t<string>('No active validators found')
      }
      emptySpinner={
        <>
          {!waiting && <div>{t<string>('Retrieving validators')}</div>}
          {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
          {isIntentions
            ? !nominatedBy && <div>{t<string>('Retrieving nominators')}</div>
            : !recentlyOnline && <div>{t<string>('Retrieving online status')}</div>
          }
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
      isSplit
      legend={
        <Legend
          isRelay={!isIntentions && !!(api.query.parasShared || api.query.shared)?.activeValidatorIndices}
          minCommission={minCommission}
        />
      }
    >
      {list && list.map(([address, isElected, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isElected={isElected}
          isFavorite={isFavorite}
          isMain={!isIntentions}
          isPara={isIntentions ? false : paraValidators[address]}
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

const ANIM = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
  10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
  20, 21, 22, 23, 24
].map((n) => `
  .greyAnim-${n} {
    animation: greyAnim${n} 1s;
  }

  @keyframes greyAnim${n} {
    0% { background: #a6a6a6; }
    50% { background: darkorange; }
    100% { background: #a6a6a6; }
  }
`).join('');

export default React.memo(styled(CurrentList)`${ANIM}`);
