// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, EraPoints, Points } from '@polkadot/types/interfaces';
import { ValidatorFilter } from '../types';

import React, { useContext, useEffect, useState } from 'react';
import { ApiContext } from '@polkadot/react-api';
import { Columar, Column, Dropdown, FilterOverlay } from '@polkadot/react-components';
import store from 'store';
import keyring from '@polkadot/ui-keyring';

import { STORE_FAVS } from '../constants';
import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  authorsMap: Record<string, string>;
  lastAuthors?: string[];
  next: string[];
  recentlyOnline?: DerivedHeartbeats;
  stakingOverview?: DerivedStakingOverview;
}

type AccountExtend = [string, boolean, boolean, Points?];

function filterAccounts (accounts: string[] = [], elected: string[], favorites: string[], without: string[], eraPoints?: EraPoints): AccountExtend[] {
  return accounts
    .filter((accountId): boolean => !without.includes(accountId as any))
    .sort((a, b): number => {
      const isFavA = favorites.includes(a);
      const isFavB = favorites.includes(b);

      return isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1);
    })
    .map((accountId): AccountExtend => {
      const electedIdx = elected.indexOf(accountId);

      return [
        accountId,
        elected.includes(accountId),
        favorites.includes(accountId),
        electedIdx !== -1
          ? eraPoints?.individual[electedIdx]
          : undefined
      ];
    });
}

function accountsToString (accounts: AccountId[]): string[] {
  return accounts.map((accountId): string => accountId.toString());
}

function CurrentList ({ authorsMap, lastAuthors, next, recentlyOnline, stakingOverview, t }: Props): React.ReactElement<Props> {
  const { isSubstrateV2 } = useContext(ApiContext);
  const [favorites, setFavorites] = useState<string[]>(store.get(STORE_FAVS, []));
  const [filter, setFilter] = useState<ValidatorFilter>('all');
  const [myAccounts] = useState(keyring.getAccounts().map(({ address }): string => address));
  const [{ elected, validators, waiting }, setFiltered] = useState<{ elected: AccountExtend[]; validators: AccountExtend[]; waiting: AccountExtend[] }>({ elected: [], validators: [], waiting: [] });

  useEffect((): void => {
    if (stakingOverview) {
      const _elected = accountsToString(stakingOverview.currentElected);
      const _validators = accountsToString(stakingOverview.validators);
      const validators = filterAccounts(_validators, _elected, favorites, [], stakingOverview.eraPoints);
      const elected = isSubstrateV2 ? filterAccounts(_elected, _elected, favorites, _validators) : [];

      setFiltered({
        elected,
        validators,
        waiting: filterAccounts(next, [], favorites, _elected)
      });
    }
  }, [favorites, next, stakingOverview]);

  const _onFavorite = (accountId: string): void =>
    setFavorites(
      store.set(
        STORE_FAVS,
        favorites.includes(accountId)
          ? favorites.filter((thisOne): boolean => thisOne !== accountId)
          : [...favorites, accountId]
      )
    );

  const _renderColumn = (addresses: AccountExtend[], defaultName: string, withOnline: boolean): React.ReactNode =>
    addresses.map(([address, isElected, isFavorite, points]): React.ReactNode => (
      <Address
        address={address}
        authorsMap={authorsMap}
        defaultName={defaultName}
        filter={filter}
        isElected={isElected}
        isFavorite={isFavorite}
        lastAuthors={lastAuthors}
        key={address}
        myAccounts={myAccounts}
        onFavorite={_onFavorite}
        points={points}
        recentlyOnline={
          withOnline
            ? recentlyOnline
            : undefined
        }
      />
    ));

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
          {validators.length !== 0 && _renderColumn(validators, t('validator'), true)}
        </Column>
        <Column
          emptyText={t('No addresses found')}
          headerText={t('next up')}
        >
          {(elected.length !== 0 || waiting.length !== 0) && (
            <>
              {_renderColumn(elected, t('intention'), false)}
              {_renderColumn(waiting, t('intention'), false)}
            </>
          )}
        </Column>
      </Columar>
    </div>
  );
}

export default translate(CurrentList);
