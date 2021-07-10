// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BlockNumber, Scheduled } from '@polkadot/types/interfaces';
import type { ScheduledExt } from './types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';

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
  const bestNumber = useBestNumber();
  const items = useCall<ScheduledExt[]>(api.query.scheduler.agenda.entries, undefined, transformEntries);

  const filtered = useMemo(
    () => bestNumber && items && items.filter(({ blockNumber }) => blockNumber.gte(bestNumber)),
    [bestNumber, items]
  );

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
      empty={filtered && t<string>('No active schedules')}
      header={headerRef.current}
    >
      {filtered?.map((value): React.ReactNode => (
        <ScheduledView
          bestNumber={bestNumber}
          key={value.key}
          value={value}
        />
      ))}
    </Table>
  );
}

export default React.memo(Schedule);
