// Copyright 2017-2025 @polkadot/app-calendar authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal, DeriveDispatch, DeriveReferendumExt, DeriveSessionProgress } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { BlockNumber, EraIndex, LeasePeriodOf, Scheduled, UnappliedSlash } from '@polkadot/types/interfaces';
import type { ITuple } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';
import type { EntryInfo, EntryInfoTyped, EntryType } from './types.js';

import { useEffect, useState } from 'react';

import { useLeaseRangeMax } from '@polkadot/app-parachains/useLeaseRanges';
import { createNamedHook, useApi, useBestNumber, useBlockInterval, useCall } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

interface DateExt {
  date: Date;
  dateTime: number;
}

type SlashEntry = [{ args: [EraIndex] }, UnappliedSlash[]];

type ScheduleEntry = [{ args: [BlockNumber] }, Option<Scheduled>[]];

function newDate (blocks: BN, blockTime: BN): DateExt {
  const date = new Date(Date.now() + blocks.mul(blockTime).toNumber());

  return { date, dateTime: date.getTime() };
}

function createConstDurations (bestNumber: BlockNumber, blockTime: BN, items: [EntryType, BlockNumber?, BN?, BN?][]): [EntryType, EntryInfo[]][] {
  return items.map(([type, duration, additional = BN_ZERO, offset = BN_ZERO]): [EntryType, EntryInfo[]] => {
    if (!duration) {
      return [type, []];
    }

    const startNumber = bestNumber.sub(offset);
    const blocks = duration.sub(startNumber.mod(duration));

    return [type, [{
      ...newDate(blocks, blockTime),
      blockNumber: startNumber.add(blocks),
      blocks,
      info: startNumber.div(duration).iadd(additional)
    }]];
  });
}

function createCouncilMotions (bestNumber: BlockNumber, blockTime: BN, motions: DeriveCollectiveProposal[]): [EntryType, EntryInfo[]][] {
  return [['councilMotion', motions
    .map(({ hash, votes }): EntryInfo | null => {
      if (!votes) {
        return null;
      }

      const hashStr = hash.toHex();
      const blocks = votes.end.sub(bestNumber);

      return {
        ...newDate(blocks, blockTime),
        blockNumber: votes.end,
        blocks,
        info: `${hashStr.slice(0, 6)}…${hashStr.slice(-4)}`
      };
    })
    .filter((item): item is EntryInfo => !!item)
  ]];
}

function createDispatches (bestNumber: BlockNumber, blockTime: BN, dispatches: DeriveDispatch[]): [EntryType, EntryInfo[]][] {
  return dispatches.map(({ at, index }): [EntryType, EntryInfo[]] => {
    const blocks = at.sub(bestNumber);

    return ['democracyDispatch', [{
      ...newDate(blocks, blockTime),
      blockNumber: at,
      blocks,
      info: index
    }]];
  });
}

function createReferendums (bestNumber: BlockNumber, blockTime: BN, referendums: DeriveReferendumExt[]): [EntryType, EntryInfo[]][] {
  return referendums.reduce((result: [EntryType, EntryInfo[]][], { index, status }): [EntryType, EntryInfo[]][] => {
    const enactBlocks = status.end.add(status.delay).isub(bestNumber);
    const voteBlocks = status.end.sub(bestNumber).isub(BN_ONE);

    result.push(['referendumVote', [{
      ...newDate(voteBlocks, blockTime),
      blockNumber: bestNumber.add(voteBlocks),
      blocks: voteBlocks,
      info: index
    }]]);
    result.push(['referendumDispatch', [{
      ...newDate(enactBlocks, blockTime),
      blockNumber: bestNumber.add(enactBlocks),
      blocks: enactBlocks,
      info: index,
      isPending: true
    }]]);

    return result;
  }, []);
}

function createStakingInfo (bestNumber: BlockNumber, blockTime: BN, sessionInfo: DeriveSessionProgress, unapplied: SlashEntry[], slashDeferDuration?: BlockNumber): [EntryType, EntryInfo[]][] {
  const blocksEra = sessionInfo.eraLength.sub(sessionInfo.eraProgress);
  const blocksSes = sessionInfo.sessionLength.sub(sessionInfo.sessionProgress);
  const slashDuration = slashDeferDuration?.mul(sessionInfo.eraLength);
  const slashEras = slashDuration
    ? unapplied
      .filter(([, values]) => values.length)
      .map(([key]): EntryInfo => {
        const eraIndex = key.args[0];
        const blockProgress = sessionInfo.activeEra.sub(eraIndex).isub(BN_ONE).imul(sessionInfo.eraLength).iadd(sessionInfo.eraProgress);
        const blocks = slashDuration.sub(blockProgress);

        return {
          ...newDate(blocks, blockTime),
          blockNumber: bestNumber.add(blocks),
          blocks,
          info: eraIndex
        };
      })
    : [];

  return [
    ['stakingEpoch', [{
      ...newDate(blocksSes, blockTime),
      blockNumber: bestNumber.add(blocksSes),
      blocks: blocksSes,
      info: sessionInfo.currentIndex.add(BN_ONE)
    }]],
    ['stakingEra', [{
      ...newDate(blocksEra, blockTime),
      blockNumber: bestNumber.add(blocksEra),
      blocks: blocksEra,
      info: sessionInfo.activeEra.add(BN_ONE)
    }]],
    ['stakingSlash', slashEras]
  ];
}

function createScheduled (bestNumber: BlockNumber, blockTime: BN, scheduled: ScheduleEntry[]): [EntryType, EntryInfo[]][] {
  return [['scheduler', scheduled
    .filter(([, vecSchedOpt]) => vecSchedOpt.some((schedOpt) => schedOpt.isSome))
    .reduce((items: EntryInfo[], [key, vecSchedOpt]): EntryInfo[] => {
      const blockNumber = key.args[0];

      return vecSchedOpt
        .filter((schedOpt) => schedOpt.isSome)
        .map((schedOpt) => schedOpt.unwrap())
        .reduce((items: EntryInfo[], { maybeId }) => {
          const idOrNull = maybeId.unwrapOr(null);
          const blocks = blockNumber.sub(bestNumber);

          items.push({
            ...newDate(blocks, blockTime),
            blockNumber,
            blocks,
            info: idOrNull
              ? idOrNull.isAscii
                ? idOrNull.toUtf8()
                : idOrNull.toHex()
              : null
          });

          return items;
        }, items);
    }, [])]];
}

function createAuctionInfo (bestNumber: BlockNumber, blockTime: BN, rangeMax: BN, [leasePeriod, endBlock]: [LeasePeriodOf, BlockNumber]): [EntryType, EntryInfo[]][] {
  const blocks = endBlock.sub(bestNumber);

  return [
    ['parachainAuction', [{
      ...newDate(blocks, blockTime),
      blockNumber: endBlock,
      blocks,
      info: `${leasePeriod.toString()} - ${leasePeriod.add(rangeMax).toString()}`
    }]]
  ];
}

function addFiltered (state: EntryInfoTyped[], types: [EntryType, EntryInfo[]][]): EntryInfoTyped[] {
  return types.reduce((state: EntryInfoTyped[], [typeFilter, items]): EntryInfoTyped[] => {
    return state
      .filter(({ type }) => type !== typeFilter)
      .concat(...items.map((item): EntryInfoTyped => {
        (item as EntryInfoTyped).type = typeFilter;

        return item as EntryInfoTyped;
      }));
  }, state);
}

// TODO council votes, tips closing
function useScheduledImpl (): EntryInfoTyped[] {
  const { api } = useApi();
  const blockTime = useBlockInterval();
  const bestNumber = useBestNumber();
  const leaseRangeMax = useLeaseRangeMax();
  const auctionInfo = useCall<Option<ITuple<[LeasePeriodOf, BlockNumber]>>>(api.query.auctions?.auctionInfo);
  const councilMotions = useCall<DeriveCollectiveProposal[]>(api.derive.council?.proposals);
  const dispatches = useCall<DeriveDispatch[]>(api.derive.democracy?.dispatchQueue);
  const referendums = useCall<DeriveReferendumExt[]>(api.derive.democracy?.referendums);
  const scheduled = useCall<ScheduleEntry[]>(api.query.scheduler?.agenda?.entries);
  const sessionInfo = useCall<DeriveSessionProgress>(api.derive.session?.progress);
  const slashes = useCall<SlashEntry[]>(api.query.staking?.unappliedSlashes.entries);
  const [state, setState] = useState<EntryInfoTyped[]>([]);

  useEffect((): void => {
    bestNumber && dispatches && setState((state) =>
      addFiltered(state, createDispatches(bestNumber, blockTime, dispatches))
    );
  }, [bestNumber, blockTime, dispatches]);

  useEffect((): void => {
    bestNumber && councilMotions && setState((state) =>
      addFiltered(state, createCouncilMotions(bestNumber, blockTime, councilMotions))
    );
  }, [bestNumber, blockTime, councilMotions]);

  useEffect((): void => {
    bestNumber && referendums && setState((state) =>
      addFiltered(state, createReferendums(bestNumber, blockTime, referendums))
    );
  }, [bestNumber, blockTime, referendums]);

  useEffect((): void => {
    bestNumber && scheduled && setState((state) =>
      addFiltered(state, createScheduled(bestNumber, blockTime, scheduled))
    );
  }, [bestNumber, blockTime, scheduled]);

  useEffect((): void => {
    bestNumber && sessionInfo?.sessionLength.gt(BN_ONE) && setState((state) =>
      addFiltered(state, createStakingInfo(bestNumber, blockTime, sessionInfo, slashes || [], api.consts.staking?.slashDeferDuration))
    );
  }, [api, bestNumber, blockTime, sessionInfo, slashes]);

  useEffect((): void => {
    bestNumber && auctionInfo?.isSome && setState((state) =>
      addFiltered(state, createAuctionInfo(bestNumber, blockTime, leaseRangeMax, auctionInfo.unwrap()))
    );
  }, [auctionInfo, bestNumber, blockTime, leaseRangeMax]);

  useEffect((): void => {
    bestNumber && setState((state) =>
      addFiltered(state, createConstDurations(bestNumber, blockTime, [
        ['councilElection', (api.consts.elections || api.consts.phragmenElection || api.consts.electionsPhragmen)?.termDuration],
        ['democracyLaunch', api.consts.democracy?.launchPeriod],
        ['parachainLease', api.consts.slots?.leasePeriod as BlockNumber, BN_ONE, api.consts.slots?.leaseOffset as BlockNumber],
        ['societyChallenge', api.consts.society?.challengePeriod],
        ['societyRotate', api.consts.society?.rotationPeriod as BlockNumber],
        ['treasurySpend', api.consts.treasury?.spendPeriod]
      ]))
    );
  }, [api, bestNumber, blockTime]);

  return state;
}

export default createNamedHook('useScheduled', useScheduledImpl);
