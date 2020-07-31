// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BlockNumber, Scheduled } from '@polkadot/types/interfaces';
import { ScheduledExt } from './types';

import React, { useMemo } from 'react';
import { Table } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';

import { useTranslation } from '../translate';
import ScheduledView from './Scheduled';

interface Props {
  className?: string;
}

function Schedule ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const items = useCall<ScheduledExt[]>(api.query.scheduler.agenda.entries as any, [], {
    transform: (entries: [{ args: [BlockNumber] }, Option<Scheduled>[]][]): ScheduledExt[] =>
      entries
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
        }, [])
  });

  const header = useMemo(() => [
    [t('scheduled'), 'start'],
    [t('remaining')],
    [t('period')],
    [t('count')]
  ], [t]);

  return (
    <Table
      className={className}
      empty={items?.length === 0 && t<string>('No active schedules')}
      header={header}
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
