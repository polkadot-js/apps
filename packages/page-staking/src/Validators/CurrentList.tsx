// Copyright 2017-2024 @polkadot/app-staking authors & contributors
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
import Address from './Address';

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
  paraValidators: Record<string, boolean>;
  recentlyOnline?: DeriveHeartbeats;
  setNominators?: (nominators: string[]) => void;
  stakingOverview?: DeriveStakingOverview;
  targets: ValidatorInfo[];
  toggleFavorite: (address: string) => void;
  onVoteSuccess: () => Promise<void>
}

type AccountExtend = [string, boolean, boolean];

interface Filtered {
  validators?: AccountExtend[];
  waiting?: AccountExtend[];
}

function filterAccounts (isOwn: boolean, accounts: string[] = [], elected: string[], favorites: string[], without: string[]): AccountExtend[] {
  return accounts
    .filter((accountId): boolean => !without.includes(accountId as any))
    .map((accountId): AccountExtend => [
      accountId,
      elected.includes(accountId),
      favorites.includes(accountId)
    ])
    .sort(([, , isFavA]: AccountExtend, [, , isFavB]: AccountExtend): number =>
      isFavA === isFavB
        ? 0
        : (isFavA ? -1 : 1)
    );
}

function accountsToString (accounts: AccountId[]): string[] {
  const result = new Array<string>(accounts.length);

  for (let i = 0; i < accounts.length; i++) {
    result[i] = accounts[i].toString();
  }

  return result;
}

function getFiltered (isOwn: boolean, stakingOverview: DeriveStakingOverview | undefined, favorites: string[], next?: string[]): Filtered {
  if (!stakingOverview) {
    return {};
  }
  const allElected = [""]
  const validatorIds: any[] = stakingOverview.validators

  // const allElected = accountsToString(stakingOverview.nextElected);
  // const validatorIds = accountsToString(stakingOverview.validators);

  return {
    validators: filterAccounts(isOwn, validatorIds, allElected, favorites, []),
    waiting: filterAccounts(isOwn, allElected, allElected, favorites, validatorIds).concat(
      filterAccounts(isOwn, next, [], favorites, allElected)
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

function CurrentList ({ className, favorites, hasQueries, isIntentions, isOwn, minCommission, nominatedBy, paraValidators = DEFAULT_PARAS, recentlyOnline, stakingOverview, targets, toggleFavorite, onVoteSuccess }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { byAuthor, eraPoints } = useBlockAuthors();
  const [nameFilter, setNameFilter] = useState<string>('');
  const isNextTick = useNextTick();

  const { validators, waiting } = useMemo(
    () => getFiltered(isOwn, stakingOverview, favorites, targets.waitingIds),
    [favorites, isOwn, stakingOverview, targets]
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
    // isIntentions
    //   ? [
    //     [t('intentions'), 'start', 3],
    //     [t('nominators'), 'expand'],
    //     [t('total staked'), 'expand'],
    //     [t('Pots Balances')],
    //     [],
    //     []
    //   ]
    //   : [
      [
        [t('validators'), 'start', 3],
        [t('name'), 'expand'],
        [t('status'), 'expand'],
        // [t('other stake'), 'expand'],
        [t('total staked'), 'expand'],
        // [t('commission')],
        // [`${t('reward')}(GOV)`],
        [`${t('reward')}(BTC)`],
        [t('last #')],
        [],
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
      {validators?.map(([address, isElected, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          filterName={nameFilter}
          hasQueries={hasQueries}
          isElected={isElected}
          isFavorite={isFavorite}
          isMain={true}
          isPara={paraValidators[address]}
          key={address}
          lastBlock={byAuthor[address]}
          minCommission={minCommission}
          nominatedBy={nominatedBy?.[address]}
          points={eraPoints[address]}
          recentlyOnline={recentlyOnline?.[address]}
          toggleFavorite={toggleFavorite}
          validatorInfo={targets.find(item => item.account === address)}
          onVoteSuccess={onVoteSuccess}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
