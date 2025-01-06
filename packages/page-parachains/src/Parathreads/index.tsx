// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { LeasePeriod, OwnedId, QueuedAction } from '../types.js';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate.js';
import Actions from './Actions.js';
import Parathread from './Parathread.js';
import useParaMap from './useParaMap.js';

interface Props {
  actionsQueue: QueuedAction[];
  className?: string;
  ids?: ParaId[];
  leasePeriod?: LeasePeriod;
  ownedIds: OwnedId[];
}

function Parathreads ({ actionsQueue, className, ids, leasePeriod, ownedIds }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const leaseMap = useParaMap(ids);

  const headerRef = useRef<([React.ReactNode?, string?, number?] | false)[]>([
    [t('parathreads'), 'start', 2],
    ['', 'media--2000'],
    [t('head'), 'start media--1500'],
    [t('lifecycle'), 'start'],
    [],
    [], // [t('chain'), 'no-pad-left'],
    [t('leases')],
    ['', 'media--900']
  ]);

  return (
    <div className={className}>
      <Actions ownedIds={ownedIds} />
      <Table
        empty={leasePeriod && ids && (ids.length === 0 || leaseMap) && t('There are no available parathreads')}
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
