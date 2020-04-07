// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { AddressDetails } from './types';

import React, { useCallback, useEffect, useReducer, useState } from 'react';
import { Input, Table } from '@polkadot/react-components';
import { useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../constants';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  authorsMap: Record<string, string>;
  hasQueries: boolean;
  isIntentions?: boolean;
  lastAuthors?: string[];
  next?: string[];
  recentlyOnline?: DeriveHeartbeats;
  setNominators: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
  elected?: AccountExtend[];
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
}

function filterAccounts (accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId): boolean => !without.includes(accountId as any))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([,, isFavA]: AccountExtend, [,, isFavB]: AccountExtend): number =>
      isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1)
    );
}

function accountsToString (accounts: AccountId[]): string[] {
  return accounts.map((accountId): string => accountId.toString());
}

function reduceDetails (state: Record<string, AddressDetails>, _details: AddressDetails | AddressDetails[]): Record<string, AddressDetails> {
  const details = Array.isArray(_details)
    ? _details
    : [_details];

  return details.reduce((result, details): Record<string, AddressDetails> => {
    result[details.address] = {
      ...(state[details.address] || {}),
      ...details
    };

    return result;
  }, { ...state });
}

function getDetails (stakingOverview: DeriveStakingOverview, validators?: AccountExtend[]): AddressDetails[] {
  const allPoints = [...stakingOverview.eraPoints.individual.entries()];

  return (validators || []).map(([address]): AddressDetails => {
    const points = allPoints.find(([accountId]): boolean => accountId.eq(address));

    return {
      address,
      points: points
        ? points[1].toNumber()
        : undefined
    };
  });
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

function CurrentList ({ authorsMap, hasQueries, isIntentions, lastAuthors, next, recentlyOnline, setNominators, stakingOverview }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [{ elected, validators, waiting }, setFiltered] = useState<Filtered>({});
  const [nameFilter, setNameFilter] = useState<string>('');
  const [addressDetails, dispatchDetails] = useReducer(reduceDetails, {});

  useEffect((): void => {
    if (stakingOverview) {
      const filtered = getFiltered(stakingOverview, favorites, next);

      setFiltered(filtered);
      dispatchDetails(
        getDetails(stakingOverview, filtered.validators)
      );
    }
  }, [favorites, next, stakingOverview]);

  const _renderRows = useCallback(
    (addresses?: AccountExtend[], isMain?: boolean): React.ReactNode[] =>
      (addresses || []).map(([address, isElected, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isAuthor={lastAuthors && lastAuthors.includes(address)}
          isElected={isElected}
          isFavorite={isFavorite}
          isMain={isMain}
          key={address}
          lastBlock={authorsMap[address]}
          onlineCount={isMain && recentlyOnline?.[address]?.blockCount.toNumber()}
          onlineMessage={isMain && recentlyOnline?.[address]?.hasMessage}
          points={isMain && addressDetails[address] && addressDetails[address].points}
          setNominators={isIntentions && setNominators}
          toggleFavorite={toggleFavorite}
        />
      )),
    [addressDetails, authorsMap, hasQueries, isIntentions, lastAuthors, nameFilter, recentlyOnline, setNominators, toggleFavorite]
  );

  return isIntentions
    ? (
      <Table
        empty={waiting && t('No waiting validators found')}
        header={[
          [t('intentions'), 'start', 9]
        ]}
      >
        {_renderRows(elected, false).concat(..._renderRows(waiting, false))}
      </Table>
    )
    : (
      <Table
        empty={validators && t('No active validators found')}
        filter={
          <Input
            autoFocus
            isFull
            label={t('filter by name, address or index')}
            onChange={setNameFilter}
            value={nameFilter}
          />
        }
        header={[
          [t('validators'), 'start', 3],
          [t('other stake')],
          [t('own stake')],
          [t('commission')],
          [t('points')],
          [t('last #')],
          []
        ]}
      >
        {_renderRows(validators, true)}
      </Table>
    );
}

export default React.memo(CurrentList);
