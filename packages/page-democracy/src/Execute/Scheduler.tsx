// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BlockNumber, Scheduled } from '@polkadot/types/interfaces';
import { ScheduledExt } from './types';

import React, { useRef } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import ScheduledView from './Scheduled';

interface Props {
  className?: string;
}

const transformEntries = {
  transform: (entries: [{ args: [BlockNumber] }, Option<Scheduled>[]][]): ScheduledExt[] => {
    return entries
      .filter(([, vecSchedOpt]) => vecSchedOpt.some((schedOpt) => schedOpt.isSome))
      .reduce((items: ScheduledExt[], [key, vecSchedOpt]): ScheduledExt[] => {
        const blockNumber = key.args[0];

        return vecSchedOpt
          .filter((schedOpt) => schedOpt.isSome)
          .map((schedOpt) => schedOpt.unwrap())
          .reduce((items: ScheduledExt[], { call, maybeId, maybePeriodic, priority }, index) => {
            items.push({ blockNumber, call, key: `${blockNumber.toString()}-${index}`, maybeId, maybePeriodic, priority });

            return items;
          }, items);
      }, []);
  }
};

function Schedule ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const items = useCall<ScheduledExt[]>(api.query.scheduler.agenda.entries as any, undefined, transformEntries);

  const headerRef = useRef([
    [t('scheduled'), 'start'],
    [t('id'), 'start'],
    [t('remaining')],
    [t('period')],
    [t('count')]
  ]);

  return (
    <Table
      className={className}
      empty={items?.length === 0 && t<string>('No active schedules')}
      header={headerRef.current}
    >
      {items?.map((scheduled): React.ReactNode => (
        <ScheduledView
          key={scheduled.key}
          value={scheduled}
        />
      ))}
    </Table>
  );
}

export default React.memo(Schedule);
