// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SortedTargets, ValidatorInfo } from '../types';

import React, { useMemo, useRef, useState } from 'react';

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { Table } from '@polkadot/react-components';
import { useApi, useCall, useLoadingDelay } from '@polkadot/react-hooks';
import { EraIndex } from '@polkadot/types/interfaces';
import { Option, Struct, u32 } from '@polkadot/types-codec';

import Filtering from '../Filtering';
import { useTranslation } from '../translate';
import Address from './Address';

interface Props {
  className?: string;
  favorites: string[];
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  session?: number;
  currentSessionCommittee: string[];
  sessionValidatorBlockCountLookup: Record<string, number>;
}

type AccountExtend = [string, boolean];

interface Filtered {
  validators?: AccountExtend[];
}

function sortAccountByFavourites (accounts: string[], favorites: string[]): AccountExtend[] {
  return accounts
    .map((accountId): AccountExtend => [
      accountId,
      favorites.includes(accountId)
    ])
    .sort(([, isFavA]: AccountExtend, [, isFavB]: AccountExtend): number => {
      return isFavA === isFavB ? 0 : (isFavA ? -1 : 1);
    });
}

function getFiltered (favorites: string[], currentSessionCommittee: string[], targets?: SortedTargets): Filtered {
  if (!targets) {
    return {};
  }

  return {
    validators: sortAccountByFavourites(currentSessionCommittee, favorites)
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

type SessionIndexEntry = [{ args: [EraIndex] }, Option<u32>];

interface CommitteeSize extends Struct {
  nonReservedSeats: u32
  reservedSeats: u32,
}

function CurrentList ({ className, currentSessionCommittee, favorites, session, sessionValidatorBlockCountLookup, targets, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [nameFilter, setNameFilter] = useState<string>('');
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session.progress);
  // to be used later on
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const committeeSize = useCall<CommitteeSize>(api.query.elections.committeeSize);
  const erasStartSessionIndex = useCall<SessionIndexEntry[]>(api.query.staking.erasStartSessionIndex.entries);

  // to be used later on
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [era, eraFirstSession, eraLastSession]: [number | undefined, number | undefined, number | undefined] = useMemo(
    () => {
      if (!sessionInfo || !erasStartSessionIndex || !session) {
        return [undefined, undefined, undefined];
      }

      const erasStartSessionIndexLookup: Record<number, number> = {};

      erasStartSessionIndex.filter(([, values]) => values.isSome)
        .forEach(([key, values]) => {
          const eraIndex = key.args[0];

          erasStartSessionIndexLookup[eraIndex.toNumber()] = values.unwrap().toNumber();
        });

      let currentEra = sessionInfo.activeEra.toNumber();
      let currentEraSessionStart: number = erasStartSessionIndexLookup[currentEra];
      let currentEraSessionEnd;

      while (currentEraSessionStart > session) {
        currentEraSessionEnd = currentEraSessionStart - 1;
        currentEra = currentEra - 1;
        currentEraSessionStart = erasStartSessionIndexLookup[currentEra];
      }

      return [currentEra, currentEraSessionStart, currentEraSessionEnd];
    },
    [erasStartSessionIndex, sessionInfo, session]
  );

  const blocksTarget = useMemo(
    () => {
      if (!committeeSize || !sessionInfo) {
        return;
      }

      const sessionPeriod = api.consts.elections.sessionPeriod;

      const currentCommitteeSize = committeeSize.nonReservedSeats.toNumber() + committeeSize.reservedSeats.toNumber();

      return Math.round(Number(sessionPeriod.toString()) / currentCommitteeSize);
    },
    [committeeSize, sessionInfo, api]
  );

  const isLoading = useLoadingDelay();

  const { validators } = useMemo(
    () => getFiltered(favorites, currentSessionCommittee, targets),
    [favorites, targets, currentSessionCommittee]
  );

  const list = useMemo(
    () => !isLoading && validators,
    [isLoading, validators]
  );

  const infoMap = useMemo(
    () => targets.validators && mapValidators(targets.validators),
    [targets]
  );

  const headerRef = useRef(
    [
      [t('validators'), 'start', 2],
      [t('blocks created'), 'expand'],
      [t('blocks expected'), 'media--1100'],
      [t('max % reward')],
      [],
      [undefined, 'media--1200']
    ]
  );

  return (
    <Table
      className={className}
      empty={
        list && infoMap && t<string>('No active validators found')
      }
      emptySpinner={
        <>
          {!validators && <div>{t<string>('Retrieving validators')}</div>}
          {!infoMap && <div>{t<string>('Retrieving validator info')}</div>}
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
    >
      {list && list.map(([address, isFavorite]): React.ReactNode => (
        <Address
          address={address}
          blocksCreated={sessionValidatorBlockCountLookup ? sessionValidatorBlockCountLookup[address] : 0}
          blocksTarget={blocksTarget || 0}
          filterName={nameFilter}
          isFavorite={isFavorite}
          key={address}
          rewardPercentage={0}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </Table>
  );
}

export default React.memo(CurrentList);
