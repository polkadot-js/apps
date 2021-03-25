// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { LeasePeriod } from '../types';
import type { QueuedAction } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Upcoming from './Upcoming';

interface Props {
  actionsQueue: QueuedAction[];
  ids?: ParaId[];
  leasePeriod: LeasePeriod | null;
}

function Upcomings ({ actionsQueue, ids, leasePeriod }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('upcoming'), 'start', 3],
    [t('head'), 'start'],
    [t('lifecycle'), 'start'],
    [t('leases')]
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no upcoming parachains')}
      header={headerRef.current}
    >
      {ids?.map((id): React.ReactNode => (
        <Upcoming
          id={id}
          key={id.toString()}
          leasePeriod={leasePeriod}
          nextAction={actionsQueue.find(({ paraIds }) =>
            paraIds.some((p) => p.eq(id))
          )}
        />
      ))}
    </Table>
  );
}

export default React.memo(Upcomings);
