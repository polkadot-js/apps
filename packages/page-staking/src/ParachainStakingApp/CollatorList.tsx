// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHeartbeats, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { Authors } from '@polkadot/react-query/BlockAuthors';
import type { AccountId } from '@polkadot/types/interfaces';
// import type { SortedTargets, ValidatorInfo } from '../types';

import React, { useContext, useMemo, useRef, useState } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay, useSavedFlags } from '@polkadot/react-hooks';
//import { BlockAuthorsContext } from '@polkadot/react-query';

// import Filtering from '../Filtering';
// import Legend from '../Legend';
import { useTranslation } from '../translate';
// import useNominations from '../useNominations';
// import Address from './Address';
import CollatorDetails from './CollatorDetails';
import { OwnerAmount } from './Summary';

interface Props {
    collators:OwnerAmount[]|undefined
    collatorInfo:{minNomination:string,maxNominatorsPerCollator:string}
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
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
  return accounts.map((a) => a.toString());
}

function getFiltered (stakingOverview: DeriveStakingOverview, favorites: string[], next?: string[]): Filtered {
  const allElected = accountsToString(stakingOverview.nextElected);
  const validatorIds = accountsToString(stakingOverview.validators);

  return {
    validators: filterAccounts(validatorIds, allElected, favorites, []),
    waiting: filterAccounts(allElected, allElected, favorites, validatorIds).concat(
      filterAccounts(next, [], favorites, allElected)
    )
  };
}

const DEFAULT_PARAS = {};

function CollatorList ({ collators, collatorInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const isLoading = useLoadingDelay();


  const headerRef = useRef(
    [
        [t('collators'), 'start'],
        [t('counted nominator stake'), 'media--1100'],
        [t('total nominator stake'), 'media--1100'],
        [t('# of nominators'), 'media--1100'],
        [t('own stake'), 'media--1100'],
        [t('min contribution'), 'media--1100'],
        // [t('stake'), 'media--1100'],
      ]
  );

  return (
    <Table
      header={headerRef.current}
    >
      {!isLoading && (
        collators?.sort((a,b)=>{
            return Number(b.amount.sub(a.amount))
        }).map(({amount,owner}): React.ReactNode => (
        <CollatorDetails
          address={owner}
          collatorStake={amount}
          key={owner}
          collatorInfo={collatorInfo}
        />
      )))}
    </Table>
  );
}

export default React.memo(CollatorList);
