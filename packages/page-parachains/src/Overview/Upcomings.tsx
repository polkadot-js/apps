// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';
import type { ParaId } from '@polkadot/types/interfaces';
import type { QueuedAction } from './types';

import React, { useRef } from 'react';

import { Table } from '@polkadot/react-components';

import { useTranslation } from '../translate';
import Upcoming from './Upcoming';

interface Props {
  actionsQueue: QueuedAction[];
  currentPeriod: BN | null;
  ids?: ParaId[];
}

function Upcomings ({ actionsQueue, currentPeriod, ids }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const headerRef = useRef([
    [t('upcoming'), 'start', 2],
    [t('head'), 'start'],
    [t('lifecycle'), 'start'],
    [],
    [t('leases'), 'start']
  ]);

  return (
    <Table
      empty={ids && t<string>('There are no upcoming parachains')}
      header={headerRef.current}
    >
      {ids?.map((id): React.ReactNode => (
        <Upcoming
          currentPeriod={currentPeriod}
          id={id}
          key={id.toString()}
          nextAction={actionsQueue.find(({ paraIds }) =>
            paraIds.some((p) => p.eq(id))
          )}
        />
      ))}
    </Table>
  );
}

export default React.memo(Upcomings);
