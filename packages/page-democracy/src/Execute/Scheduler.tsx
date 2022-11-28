// Copyright 2017-2022 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { BlockNumber, Call, Scheduled } from '@polkadot/types/interfaces';
import type { FrameSupportScheduleMaybeHashed, PalletSchedulerScheduledV3 } from '@polkadot/types/lookup';
import type { ScheduledExt } from './types';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import ScheduledView from './Scheduled';

interface Props {
  className?: string;
}

const OPT_SCHED = {
  transform: (entries: [{ args: [BlockNumber] }, Option<Scheduled | PalletSchedulerScheduledV3>[]][]): ScheduledExt[] => {
    return entries
      .filter(([, all]) => all.some((o) => o.isSome))
      .reduce((items: ScheduledExt[], [key, all]): ScheduledExt[] => {
        const blockNumber = key.args[0];

        return all
          .filter((o) => o.isSome)
          .map((o) => o.unwrap())
          .reduce((items: ScheduledExt[], { call: callOrEnum, maybeId, maybePeriodic, priority }, index) => {
            let call: Call | null = null;

            if ((callOrEnum as unknown as FrameSupportScheduleMaybeHashed).inner) {
              if ((callOrEnum as unknown as FrameSupportScheduleMaybeHashed).isValue) {
                call = (callOrEnum as unknown as FrameSupportScheduleMaybeHashed).asValue;
              }
            } else {
              call = callOrEnum as Call;
            }

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
  const items = useCall<ScheduledExt[]>(api.query.scheduler.agenda.entries, undefined, OPT_SCHED);

  const filtered = useMemo(
    () => bestNumber && items &&
      items
        .filter(({ blockNumber }) => blockNumber.gte(bestNumber))
        .sort((a, b) => a.blockNumber.cmp(b.blockNumber)),
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
