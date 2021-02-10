// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { Authors } from '@polkadot/react-query/BlockAuthors';
import type { AccountId } from '@polkadot/types/interfaces';
import type { SortedTargets, ValidatorInfo } from '../types';

import React, { useCallback, useContext, useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay, useSavedFlags } from '@polkadot/react-hooks';
import { BlockAuthorsContext } from '@polkadot/react-query';

import Filtering from '../Filtering';
import Legend from '../Legend';
import { useTranslation } from '../translate';
import useNominations from '../useNominations';
import Address from './Address';

interface Props {
  favorites: string[];
  hasQueries: boolean;
  isIntentions?: boolean;
  setNominators?: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
  elected?: AccountExtend[];
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
}

const EmptyAuthorsContext: React.Context<Authors> = React.createContext<Authors>({ byAuthor: {}, eraPoints: {}, lastBlockAuthors: [], lastHeaders: [] });

function filterAccounts (accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId) => !without.includes(accountId))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([,, isFavA]: AccountExtend, [,, isFavB]: AccountExtend) =>
      isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1)
    );
}

function accountsToString (accounts: AccountId[]): string[] {
  return accounts.map((accountId) => accountId.toString());
}

function getFiltered (stakingOverview: DeriveStakingOverview, favorites: string[], next?: string[]): Filtered {
  const allElected = accountsToString(stakingOverview.nextElected);
  const validatorIds = accountsToString(stakingOverview.validators);
  const validators = filterAccounts(validatorIds, allElected, favorites, []);
  const elected = filterAccounts(allElected, allElected, favorites, validatorIds);
  const waiting = filterAccounts(next, [], favorites, allElected);

  return {
    elected,
    validators,
    waiting
  };
}

function CurrentList ({ favorites, hasQueries, isIntentions, stakingOverview, targets, toggleFavorite }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useContext(isIntentions ? EmptyAuthorsContext : BlockAuthorsContext);
  const recentlyOnline = useCall<DeriveHeartbeats>(!isIntentions && api.derive.imOnline?.receivedHeartbeats);
  const nominatedBy = useNominations(isIntentions);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [toggles, setToggle] = useSavedFlags('staking:overview', { withIdentity: false });

  // we have a very large list, so we use a loading delay
  const isLoading = useLoadingDelay();

  const { elected, validators, waiting } = useMemo(
    () => stakingOverview ? getFiltered(stakingOverview, favorites, targets.waitingIds) : {},
    [favorites, stakingOverview, targets]
  );

  const infoMap = useMemo(
    () => targets.validators?.reduce((result: Record<string, ValidatorInfo>, info): Record<string, ValidatorInfo> => {
      result[info.key] = info;

      return result;
    }, {}),
    [targets]
  );

  const headerWaitingRef = useRef([
    [t('intentions'), 'start', 2],
    [t('nominators'), 'expand'],
    [t('commission'), 'number'],
    [],
    []
  ]);

  const headerActiveRef = useRef([
    [t('validators'), 'start', 2],
    [t('other stake'), 'expand'],
    [t('own stake'), 'media--1100'],
    [t('commission')],
    [t('points')],
    [t('last #')],
    [],
    [undefined, 'media--1200']
  ]);

  const _renderRows = useCallback(
    (addresses?: AccountExtend[], isMain?: boolean): React.ReactNode[] =>
      (addresses || []).map(([address, isElected, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isElected={isElected}
          isFavorite={isFavorite}
          isMain={isMain}
          key={address}
          lastBlock={byAuthor[address]}
          nominatedBy={nominatedBy ? (nominatedBy[address] || []) : undefined}
          points={eraPoints[address]}
          recentlyOnline={recentlyOnline?.[address]}
          toggleFavorite={toggleFavorite}
          validatorInfo={infoMap?.[address]}
          withIdentity={toggles.withIdentity}
        />
      )),
    [byAuthor, eraPoints, hasQueries, infoMap, nameFilter, nominatedBy, recentlyOnline, toggleFavorite, toggles]
  );

  return isIntentions
    ? (
      <Table
        empty={!isLoading && waiting && nominatedBy && t<string>('No waiting validators found')}
        emptySpinner={
          <>
            {!waiting && <div>{t<string>('Retrieving validators')}</div>}
            {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
            {!nominatedBy && <div>{t<string>('Retrieving nominators')}</div>}
          </>
        }
        filter={
          <Filtering
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
            setWithIdentity={setToggle.withIdentity}
            withIdentity={toggles.withIdentity}
          />
        }
        header={headerWaitingRef.current}
        legend={<Legend />}
      >
        {(isLoading || !nominatedBy) ? undefined : _renderRows(elected, false).concat(_renderRows(waiting, false))}
      </Table>
    )
    : (
      <Table
        empty={!isLoading && recentlyOnline && validators && infoMap && t<string>('No active validators found')}
        emptySpinner={
          <>
            {!validators && <div>{t<string>('Retrieving validators')}</div>}
            {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
            {!recentlyOnline && <div>{t<string>('Retrieving online status')}</div>}
          </>
        }
        filter={
          <Filtering
            nameFilter={nameFilter}
            setNameFilter={setNameFilter}
            setWithIdentity={setToggle.withIdentity}
            withIdentity={toggles.withIdentity}
          />
        }
        header={headerActiveRef.current}
        legend={<Legend />}
      >
        {isLoading ? undefined : _renderRows(validators, true)}
      </Table>
    );
}

export default React.memo(CurrentList);
