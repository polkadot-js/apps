// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, EraPoints, Points } from '@polkadot/types/interfaces';
import { ValidatorFilter } from '../types';

import React, { useEffect, useState } from 'react';
import { Dropdown, FilterOverlay, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useFavorites } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../constants';
import translate from '../translate';
import Address from './Address';

interface Props extends I18nProps {
  authorsMap: Record<string, string>;
  hasQueries: boolean;
  isIntentions: boolean;
  isVisible: boolean;
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

function CurrentList ({ authorsMap, hasQueries, isIntentions, isVisible, lastAuthors, next, recentlyOnline, stakingOverview, t }: Props): React.ReactElement<Props> | null {
  const { isSubstrateV2 } = useApi();
  const { allAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [filter, setFilter] = useState<ValidatorFilter>('all');
  const [{ elected, validators, waiting }, setFiltered] = useState<{ elected: AccountExtend[]; validators: AccountExtend[]; waiting: AccountExtend[] }>({ elected: [], validators: [], waiting: [] });

  useEffect((): void => {
    if (isVisible && stakingOverview) {
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
  }, [favorites, isVisible, next, stakingOverview]);

  const _renderRows = (addresses: AccountExtend[], defaultName: string, withOnline: boolean): React.ReactNode =>
    addresses.map(([address, isElected, isFavorite, points]): React.ReactNode => (
      <Address
        address={address}
        authorsMap={authorsMap}
        defaultName={defaultName}
        filter={filter}
        hasQueries={hasQueries}
        isElected={isElected}
        isFavorite={isFavorite}
        lastAuthors={lastAuthors}
        key={address}
        myAccounts={allAccounts}
        points={points}
        recentlyOnline={
          withOnline
            ? recentlyOnline
            : undefined
        }
        toggleFavorite={toggleFavorite}
      />
    ));

  return (
    <div className={`${!isVisible && 'staking--hidden'}`}>
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
      <Table className={isIntentions ? 'staking--hidden' : ''}>
        <Table.Body>
          {_renderRows(validators, t('validators'), true)}
        </Table.Body>
      </Table>
      <Table className={isIntentions ? '' : 'staking--hidden'}>
        <Table.Body>
          {_renderRows(elected, t('intention'), false)}
          {_renderRows(waiting, t('intention'), false)}
        </Table.Body>
      </Table>
    </div>
  );
}

export default translate(CurrentList);
