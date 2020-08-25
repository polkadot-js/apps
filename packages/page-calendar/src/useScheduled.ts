// Copyright 2017-2020 @polkadot/app-calendar authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionProgress } from '@polkadot/api-derive/types';
import { BlockNumber, Scheduled } from '@polkadot/types/interfaces';
import { EntryInfo, EntryType } from './types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { useApi, useBlockTime, useCall } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { BN_ONE } from '@polkadot/util';

interface DateExt {
  date: Date;
  dateTime: number;
}

type ScheduleEntry = [{ args: [BlockNumber] }, Option<Scheduled>[]];

function newDate (remaining: BN, blockTime: number): DateExt {
  const date = new Date(Date.now() + remaining.muln(blockTime).toNumber());

  return { date, dateTime: date.getTime() };
}

function createConstDurations (bestNumber: BlockNumber, blockTime: number, items: [EntryType, BlockNumber?][]): [EntryType, EntryInfo[]][] {
  return items.map(([type, duration]): [EntryType, EntryInfo[]] => {
    if (!duration) {
      return [type, []];
    }

    const remaining = duration.sub(bestNumber.mod(duration));

    return [type, [{
      ...newDate(remaining, blockTime),
      blockNumber: bestNumber.add(remaining),
      id: type,
      type
    }]];
  });
}

function createNextEra (bestNumber: BlockNumber, blockTime: number, sessionInfo: DeriveSessionProgress): [EntryType, EntryInfo[]][] {
  const remaining = sessionInfo.eraLength.sub(sessionInfo.eraProgress);

  return [['nextEra', [{
    ...newDate(remaining, blockTime),
    blockNumber: bestNumber.add(remaining),
    id: 'nextEra',
    type: 'nextEra'
  }]]];
}

function createScheduled (bestNumber: BlockNumber, blockTime: number, scheduled: ScheduleEntry[]): [EntryType, EntryInfo[]][] {
  return [['scheduler', scheduled
    .filter(([, vecSchedOpt]) => vecSchedOpt.some((schedOpt) => schedOpt.isSome))
    .reduce((items: EntryInfo[], [key, vecSchedOpt]): EntryInfo[] => {
      const blockNumber = key.args[0];

      return vecSchedOpt
        .filter((schedOpt) => schedOpt.isSome)
        .map((schedOpt) => schedOpt.unwrap())
        .reduce((items: EntryInfo[], { maybeId }) => {
          const idOrNull = maybeId.unwrapOr(null);

          items.push({
            ...newDate(blockNumber.sub(bestNumber), blockTime),
            blockNumber,
            id: idOrNull
              ? idOrNull.isAscii
                ? idOrNull.toUtf8()
                : idOrNull.toHex()
              : 'anonymous',
            type: 'scheduler'
          });

          return items;
        }, items);
    }, [])]];
}

function addFiltered (state: EntryInfo[], types: [EntryType, EntryInfo[]][]): EntryInfo[] {
  return types.reduce((state: EntryInfo[], [typeFilter, items]): EntryInfo[] =>
    state.filter(({ type }) => type !== typeFilter).concat(...items), state
  );
}

export default function useScheduled (): EntryInfo[] {
  const { api } = useApi();
  const [blockTime] = useBlockTime();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const scheduled = useCall<ScheduleEntry[]>(api.query.scheduler?.agenda.entries as any);
  const sessionInfo = useCall<DeriveSessionProgress>(api.query.staking && api.derive.session?.progress);
  const [state, setState] = useState<EntryInfo[]>([]);

  useEffect((): void => {
    bestNumber && scheduled && setState((state) =>
      addFiltered(state, createScheduled(bestNumber, blockTime, scheduled))
    );
  }, [bestNumber, blockTime, scheduled]);

  useEffect((): void => {
    bestNumber && sessionInfo?.sessionLength.gt(BN_ONE) && setState((state) =>
      addFiltered(state, createNextEra(bestNumber, blockTime, sessionInfo))
    );
  }, [bestNumber, blockTime, sessionInfo]);

  useEffect((): void => {
    bestNumber && setState((state) =>
      addFiltered(state, createConstDurations(bestNumber, blockTime, [
        ['councilElection', (api.consts.elections || api.consts.electionsPhragmen)?.termDuration],
        ['democracyLaunch', api.consts.democracy?.launchPeriod],
        ['societyChallenge', api.consts.society?.challengePeriod],
        ['societyRotate', api.consts.society?.rotationPeriod],
        ['treasurySpend', api.consts.treasury?.spendPeriod]
      ]))
    );
  }, [api, bestNumber, blockTime]);

  return state;
}
