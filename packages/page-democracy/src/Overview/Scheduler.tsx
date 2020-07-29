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
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
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
              items.push({ blockNumber, call, count: 0, key: `${blockNumber.toString()}-${index}`, maybeId, maybePeriodic, nextBlockNumber: blockNumber, priority });

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

  let scheduled: ScheduledExt[] | undefined;

  if (bestNumber && items) {
    scheduled = items
      .map((schedule): ScheduledExt => {
        if (schedule.maybePeriodic.isSome) {
          const [inc, max] = schedule.maybePeriodic.unwrap();
          const nextBlockNumber = schedule.blockNumber.toBn();
          let count = 0;

          while (max.gtn(count) && nextBlockNumber.lt(bestNumber)) {
            count++;
            nextBlockNumber.iadd(inc);
          }

          schedule.count = count;
          schedule.nextBlockNumber = nextBlockNumber;
        }

        return schedule;
      })
      .filter(({ nextBlockNumber }) => nextBlockNumber.gt(bestNumber));
  }

  return (
    <Table
      className={className}
      empty={scheduled?.length === 0 && t<string>('No active schedules')}
      header={header}
    >
      {scheduled?.map((scheduled): React.ReactNode => (
        <ScheduledView
          key={scheduled.key}
          value={scheduled}
        />
      ))}
    </Table>
  );
}

export default React.memo(Schedule);
