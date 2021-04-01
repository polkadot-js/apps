// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { AccountId, BalanceOf, ParaId } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { LeaseInfo, LeasePeriod, QueuedAction } from '../types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Actions from './Actions';
import Parathread from './Parathread';

interface Props {
  actionsQueue: QueuedAction[];
  className?: string;
  ids?: ParaId[];
  leasePeriod?: LeasePeriod;
}

type ParaMap = [ParaId, LeaseInfo[]][];

const optLeases = {
  transform: ([[paraIds], leases]: [[ParaId[]], Option<ITuple<[AccountId, BalanceOf]>>[][]]): ParaMap =>
    paraIds
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
      .sort(([aId, aLeases], [bId, bLeases]) =>
        aLeases.length && bLeases.length
          ? (aLeases[0].period - bLeases[0].period) || aId.cmp(bId)
          : aLeases.length
            ? -1
            : bLeases.length
              ? 1
              : aId.cmp(bId)
      ),
  withParamsTransform: true
};

function Parathreads ({ actionsQueue, className, ids, leasePeriod }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const leaseMap = useCall<ParaMap>(ids && api.query.slots.leases.multi, [ids], optLeases);

  const headerRef = useRef([
    [t('parathreads'), 'start', 3],
    [t('head'), 'start'],
    [t('lifecycle'), 'start'],
    [t('leases')],
    []
  ]);

  return (
    <div className={className}>
      <Actions />
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
