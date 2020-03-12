// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AccountId } from '@polkadot/types/interfaces';
import { AddressDetails } from './types';

import React, { useEffect, useReducer, useState } from 'react';
import { Input, Spinner, Table } from '@polkadot/react-components';
import { useAccounts, useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../constants';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  authorsMap: Record<string, string>;
  hasQueries: boolean;
  isIntentions: boolean;
  isVisible: boolean;
  lastAuthors?: string[];
  next?: string[];
  recentlyOnline?: DerivedHeartbeats;
  setNominators: (nominators: string[]) => void;
  stakingOverview?: DerivedStakingOverview;
}

type AccountExtend = [string, boolean, boolean];

function sortByFav ([,, isFavA]: AccountExtend, [,, isFavB]: AccountExtend): number {
  return isFavA === isFavB
    ? 0
    : (isFavA ? -1 : 1);
}

function filterAccounts (accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId): boolean => !without.includes(accountId as any))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(sortByFav);
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

function CurrentList ({ authorsMap, hasQueries, isIntentions, isVisible, lastAuthors, next, recentlyOnline, setNominators, stakingOverview }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { allAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [{ allElected, elected, validators, waiting }, setFiltered] = useState<{ allElected: string[]; elected: AccountExtend[]; validators: AccountExtend[]; waiting?: AccountExtend[] }>({ allElected: [], elected: [], validators: [] });
  const [nameFilter, setNameFilter] = useState<string>('');
  const [addressDetails, dispatchDetails] = useReducer(reduceDetails, {});

  useEffect((): void => {
    if (isVisible && stakingOverview) {
      const allElected = accountsToString(stakingOverview.nextElected);
      const _validators = accountsToString(stakingOverview.validators);
      const validators = filterAccounts(_validators, allElected, favorites, []);
      const elected = filterAccounts(allElected, allElected, favorites, _validators);

      setFiltered({
        allElected,
        elected,
        validators,
        waiting: filterAccounts(next, [], favorites, allElected)
      });
    }
  }, [favorites, isVisible, next, stakingOverview?.nextElected, stakingOverview?.validators]);

  useEffect((): void => {
    if (stakingOverview?.eraPoints) {
      const allPoints = stakingOverview.eraPoints
        ? [...stakingOverview.eraPoints.individual.entries()]
        : [];

      dispatchDetails(validators.map(([address]): AddressDetails => {
        const points = allPoints.find(([accountId]): boolean => accountId.eq(address));

        return {
          address,
          points: points
            ? points[1]
            : undefined
        };
      }));
    }
  }, [stakingOverview?.eraPoints, allElected, validators]);

  const _renderRows = (addresses: AccountExtend[], defaultName: string, isMain: boolean): React.ReactNode =>
    addresses.map(([address, isElected, isFavorite]): React.ReactNode => (
      <Address
        address={address}
        defaultName={defaultName}
        filterName={nameFilter}
        hasQueries={hasQueries}
        heartbeat={
          isMain && recentlyOnline
            ? recentlyOnline[address]
            : undefined
        }
        isAuthor={lastAuthors && lastAuthors.includes(address)}
        isElected={isElected}
        isFavorite={isFavorite}
        isMain={isMain}
        key={address}
        lastBlock={authorsMap[address]}
        myAccounts={allAccounts}
        points={
          isMain
            ? addressDetails[address] && addressDetails[address].points
            : undefined
        }
        setNominators={isIntentions ? undefined : setNominators}
        toggleFavorite={toggleFavorite}
      />
    ));

  if (!stakingOverview) {
    return <Spinner />;
  }

  return (
    <div className={`${!isVisible && 'staking--hidden'}`}>
      <Input
        autoFocus
        isFull
        label={t('filter by name, address or index')}
        onChange={setNameFilter}
        value={nameFilter}
      />
      <Table className={isIntentions ? 'staking--hidden' : ''}>
        <Table.Body>
          {_renderRows(validators, t('validators'), true)}
        </Table.Body>
      </Table>
      {isIntentions && (
        waiting
          ? (
            <Table>
              <Table.Body>
                {_renderRows(elected, t('intention'), false)}
                {_renderRows(waiting, t('intention'), false)}
              </Table.Body>
            </Table>
          )
          : <Spinner />
      )}
    </div>
  );
}

export default React.memo(CurrentList);
