// Copyright 2017-2025 @polkadot/app-scheduler authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Bytes, Option, u8, u32 } from '@polkadot/types';
import type { BlockNumber, Call, Hash, Scheduled } from '@polkadot/types/interfaces';
import type { FrameSupportPreimagesBounded, PalletSchedulerScheduled } from '@polkadot/types/lookup';
import type { Codec, ITuple } from '@polkadot/types/types';
import type { ScheduledExt } from './types.js';

import React, { useMemo, useRef } from 'react';

import { Table } from '@polkadot/react-components';
import { useApi, useBestNumber, useCall } from '@polkadot/react-hooks';

import ScheduledView from './Scheduled.js';
import { useTranslation } from './translate.js';

interface Props {
  className?: string;
}

// included here for backwards compat
interface PalletSchedulerScheduledV3 extends Codec {
  maybeId: Option<Bytes>;
  priority: u8;
  call: FrameSupportScheduleMaybeHashed;
  maybePeriodic: Option<ITuple<[u32, u32]>>;
  origin: Codec;
}

// included here for backwards compat
interface FrameSupportScheduleMaybeHashed extends Codec {
  // added here since we use it for detection
  inner: Codec;
  // enum features
  isHash: boolean;
  isValue: boolean;
  asValue: Call;
  asHash: Hash;
}

const OPT_SCHED = {
  transform: (entries: [{ args: [BlockNumber] }, Option<Scheduled | PalletSchedulerScheduled | PalletSchedulerScheduledV3>[]][], api: ApiPromise): ScheduledExt[] => {
    return entries
      .filter(([, all]) => all.some((o) => o.isSome))
      .reduce((items: ScheduledExt[], [key, all]): ScheduledExt[] => {
        const blockNumber = key.args[0];

        return all
          .filter((o) => o.isSome)
          .map((o) => o.unwrap())
          .reduce((items: ScheduledExt[], { call: callOrEnum, maybeId, maybePeriodic, priority }, index) => {
            let call: Call | null = null;
            let preimageHash: FrameSupportPreimagesBounded | undefined;

            if ((callOrEnum as unknown as FrameSupportScheduleMaybeHashed).inner) {
              if ((callOrEnum as unknown as FrameSupportScheduleMaybeHashed).isValue) {
                call = (callOrEnum as unknown as FrameSupportScheduleMaybeHashed).asValue;
              } else if ((callOrEnum as unknown as FrameSupportPreimagesBounded).isInline) {
                try {
                  call = api.registry.createType('Call', (callOrEnum as unknown as FrameSupportPreimagesBounded).asInline.toHex());
                } catch (error) {
                  console.error(error);
                }
              } else if ((callOrEnum as unknown as FrameSupportPreimagesBounded).isLookup) {
                preimageHash = (callOrEnum as unknown as FrameSupportPreimagesBounded);
              }
            } else {
              call = callOrEnum as Call;
            }

            items.push({ blockNumber, call, key: `${blockNumber.toString()}-${index}`, maybeId, maybePeriodic, preimageHash, priority });

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
    () => bestNumber && items?.filter(({ blockNumber }) => blockNumber.gte(bestNumber)).sort((a, b) => a.blockNumber.cmp(b.blockNumber)),
    [bestNumber, items]
  );

  const headerRef = useRef<[React.ReactNode?, string?, number?][]>([
    [t('scheduled'), 'start'],
    [t('id'), 'start'],
    [t('remaining')],
    [t('period')],
    [t('count')]
  ]);

  return (
    <Table
      className={className}
      empty={filtered && t('No active schedules')}
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
