// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';
import { ValidatorFilter } from '../types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/react-components';
import store from 'store';
import keyring from '@polkadot/ui-keyring';

import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  authorsMap: Record<string, string>;
  lastAuthors?: string[];
  next: string[];
  recentlyOnline?: DerivedHeartbeats;
  stakingOverview?: DerivedStakingOverview;
}

const STORE_FAVS = 'staking:favorites';

function renderColumn (myAccounts: string[], favorites: string[], addresses: string[], defaultName: string, withOnline: boolean, filter: string, onFavorite: (accountId: string) => void, { authorsMap, lastAuthors, recentlyOnline, stakingOverview }: Props, pointIndexes?: number[]): React.ReactNode {
  return addresses.map((address, index): React.ReactNode => (
    <Address
      address={address}
      authorsMap={authorsMap}
      defaultName={defaultName}
      filter={filter}
      isElected={stakingOverview && stakingOverview.currentElected.some((accountId): boolean => accountId.eq(address))}
      isFavorite={favorites.includes(address)}
      lastAuthors={lastAuthors}
      key={address}
      myAccounts={myAccounts}
      onFavorite={onFavorite}
      points={
        stakingOverview && pointIndexes && pointIndexes[index] !== -1
          ? stakingOverview.eraPoints.individual[pointIndexes[index]]
          : undefined
      }
      recentlyOnline={
        withOnline
          ? recentlyOnline
          : undefined
      }
    />
  ));
}

function filterAccounts (list: string[] = [], without: string[], favorites: string[]): string[] {
  return list
    .filter((accountId): boolean => !without.includes(accountId as any))
    .sort((a, b): number => {
      const aIdx = favorites.includes(a);
      const bIdx = favorites.includes(b);

      return aIdx === bIdx
        ? 0
        : aIdx
          ? -1
          : 1;
    });
}

function accountsToString (accounts: AccountId[]): string[] {
  return accounts.map((accountId): string => accountId.toString());
}

function CurrentList (props: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [favorites, setFavorites] = useState<string[]>(store.get(STORE_FAVS, []));
  const [filter, setFilter] = useState<ValidatorFilter>('all');
  const [myAccounts] = useState(keyring.getAccounts().map(({ address }): string => address));
  const [{ elected, pointIndexes, validators, waiting }, setFiltered] = useState<{ elected: string[]; pointIndexes: number[]; validators: string[]; waiting: string[] }>({ elected: [], pointIndexes: [], validators: [], waiting: [] });
  const { next, stakingOverview, t } = props;

  useEffect((): void => {
    if (stakingOverview) {
      const validators = filterAccounts(accountsToString(stakingOverview.validators), [], favorites);
      const elected = isSubstrateV2 ? filterAccounts(accountsToString(stakingOverview.currentElected), validators, favorites) : [];

      setFiltered({
        elected,
        pointIndexes: validators.map((validator): number => stakingOverview.currentElected.indexOf(validator as any)),
        validators,
        waiting: filterAccounts(next, elected, favorites)
      });
    }
  }, [favorites, next, stakingOverview]);

  const _onFavorite = (accountId: string): void => {
    const newFavs = favorites.includes(accountId)
      ? favorites.filter((thisOne): boolean => thisOne !== accountId)
      : [...favorites, accountId];

    store.set(STORE_FAVS, newFavs);
    setFavorites(newFavs);
  };

  return (
    <div>
      <FilterOverlay>
        <Dropdown
          onChange={setFilter}
          options={[
            { text: t('Show all validators and intentions'), value: 'all' },
            { text: t('Show only my nominations'), value: 'iNominated' },
            { text: t('Show only with nominators'), value: 'hasNominators' },
            { text: t('Show only without nominators'), value: 'noNominators' },
            { text: t('Show only with warnings'), value: 'hasWarnings' },
            { text: t('Show only without warnings'), value: 'noWarnings' },
            { text: t('Show only elected for next session'), value: 'nextSet' }
          ]}
          value={filter}
          withLabel={false}
        />
      </FilterOverlay>
      <Columar className='validator--ValidatorsList'>
        <Column
          emptyText={t('No addresses found')}
          headerText={t('validators')}
        >
          {stakingOverview && renderColumn(myAccounts, favorites, validators, t('validator'), true, filter, _onFavorite, props, pointIndexes)}
        </Column>
        <Column
          emptyText={t('No addresses found')}
          headerText={t('next up')}
        >
          {(elected.length !== 0 || waiting.length !== 0) && (
            <>
              {renderColumn(myAccounts, favorites, elected, t('intention'), false, filter, _onFavorite, props)}
              {renderColumn(myAccounts, favorites, waiting, t('intention'), false, filter, _onFavorite, props)}
            </>
          )}
        </Column>
      </Columar>
    </div>
  );
}

export default translate(CurrentList);
