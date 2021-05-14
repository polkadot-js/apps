// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, BalanceOf, ParaId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { LeaseInfo, LeasePeriod, OwnedId, QueuedAction } from '../types';

import React, { useCallback, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall, useIsParasLinked } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Actions from './Actions';
import Parathread from './Parathread';

interface Props {
  actionsQueue: QueuedAction[];
  className?: string;
  ids?: ParaId[];
  leasePeriod?: LeasePeriod;
  ownedIds: OwnedId[];
}

type ParaMap = [ParaId, LeaseInfo[]][];

function extractParaMap (hasLinksMap: Record<string, boolean>, paraIds: ParaId[], leases: Option<ITuple<[AccountId, BalanceOf]>>[][]): ParaMap {
  return paraIds
    .reduce((all: ParaMap, id, index): ParaMap => {
      all.push([
        id,
        leases[index]
          .map((optLease, period): LeaseInfo | null => {
            if (optLease.isNone) {
              return null;
            }

            const [accountId, balance] = optLease.unwrap();

            return {
              accountId,
              balance,
              period
            };
          })
          .filter((item): item is LeaseInfo => !!item)
      ]);

      return all;
    }, [])
    .sort(([aId, aLeases], [bId, bLeases]): number => {
      const aKnown = hasLinksMap[aId.toString()] || false;
      const bKnown = hasLinksMap[bId.toString()] || false;

      return aLeases.length && bLeases.length
        ? (aLeases[0].period - bLeases[0].period) || aId.cmp(bId)
        : aLeases.length
          ? -1
          : bLeases.length
            ? 1
            : aKnown === bKnown
              ? aId.cmp(bId)
              : aKnown
                ? -1
                : 1;
    });
}

function Parathreads ({ actionsQueue, className, ids, leasePeriod, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const hasLinksMap = useIsParasLinked(ids);
  const leaseMap = useCall<ParaMap>(ids && api.query.slots.leases.multi, [ids], {
    transform: useCallback(
      ([[paraIds], leases]: [[ParaId[]], Option<ITuple<[AccountId, BalanceOf]>>[][]]): ParaMap =>
        extractParaMap(hasLinksMap, paraIds, leases),
      [hasLinksMap]
    ),
    withParamsTransform: true
  });

  const headerRef = useRef([
    [t('parathreads'), 'start', 2],
    ['', 'media--1100'],
    [t('head'), 'start media--1500'],
    [t('lifecycle'), 'start'],
    [],
    [t('chain'), 'no-pad-left'],
    [t('leases')],
    ['', 'media--900']
  ]);

  return (
    <div className={className}>
      <Actions ownedIds={ownedIds} />
      <Table
        empty={leasePeriod && ids && (ids.length === 0 || leaseMap) && t<string>('There are no available parathreads')}
        header={headerRef.current}
      >
        {leasePeriod && leaseMap?.map(([id, leases]): React.ReactNode => (
          <Parathread
            id={id}
            key={id.toString()}
            leasePeriod={leasePeriod}
            leases={leases}
            nextAction={actionsQueue.find(({ paraIds }) =>
              paraIds.some((p) => p.eq(id))
            )}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Parathreads);
