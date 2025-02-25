// Copyright 2017-2025 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainBlockConstants, CoreWorkload, LegacyLease, RegionInfo, Reservation } from '@polkadot/react-hooks/types';
import type { CoreWorkloadType, CoreWorkplanType, InfoRow } from './types.js';

import { CoreTimeTypes } from '@polkadot/react-hooks/constants';
import { BN } from '@polkadot/util';

function formatDate (date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
 * Calculation on the Relay chain
 *
 * blockTime = 6000 ms
 * BlocksPerTimeslice = 80
 * TargetBlock = TargetTimeslice * BlocksPerTimeslice
 * Block Time Difference = |TargetBlock - latest Block| * blockTime
 *
 * Estimate timestamp =
 * if targetBlock is before the latestBlock
 *    now minus block time difference
 * else
 *    now plus block time difference
 */
export const estimateTime = (
  targetTimeslice: string | number,
  latestBlock: number
): string | null => {
  if (!latestBlock || !targetTimeslice) {
    console.error('Invalid input: one or more inputs are missing');

    return null;
  }

  try {
    const now = new BN(Date.now());
    const blockTime = new BN(6000);
    const blocksPerTimeslice = new BN(80);
    const targetBlock = new BN(Number(targetTimeslice)).mul(blocksPerTimeslice);
    const latestBlockBN = new BN(latestBlock);
    const blockDifference = targetBlock.sub(latestBlockBN);
    const timeDifference = blockDifference.mul(blockTime);
    const estTimestamp = now.add(timeDifference);

    return formatDate(new Date(estTimestamp.toNumber()));
  } catch (error) {
    console.error('Error in calculation:', error);

    return null;
  }
};

/**
 *
 * @param data: CoreWorkloadType[]
 * @param core: core number
 * @param currentRegion
 * @param timeslice
 * @param param4
 * @param regionLength
 */
export function formatRowInfo (
  data: CoreWorkloadType[] | CoreWorkplanType[],
  core: number,
  regionOwnerInfo: RegionInfo | undefined,
  currentTimeSlice: number,
  currentRegion: { begin: number, end: number }, // in timeslices
  regionLength: number,
  coretimeRelayConstants: ChainBlockConstants = { blocksPerTimeslice: 0, blocktimeMs: 0 }
): InfoRow[] {
  return data.map((one: CoreWorkloadType | CoreWorkplanType) => {
    const item: InfoRow = { core, maskBits: one?.info?.maskBits, task: one?.info?.task, type: one?.type };
    const blockNumberNow = currentTimeSlice * coretimeRelayConstants.blocksPerTimeslice;

    item.type = one.type;
    let end; let start = null;

    if (one.type === CoreTimeTypes.Lease) {
      const period = Math.floor(one.lastBlock / regionLength);

      end = period * regionLength;
    }

    if ([CoreTimeTypes['Bulk Coretime'], CoreTimeTypes.Reservation, CoreTimeTypes['On Demand']].includes(one.type)) {
      start = currentRegion.begin;
      end = currentRegion.end;
    }

    item.owner = regionOwnerInfo?.owner.toString();

    item.start = start ? estimateTime(start, blockNumberNow) : null;
    item.end = end ? estimateTime(end, blockNumberNow) : null;
    item.endBlock = end ? Number(end) * coretimeRelayConstants.blocksPerTimeslice : 0;

    item.startTimeslice = start;

    if ('timeslice' in one && !start) {
      start = estimateTime(one.timeslice, blockNumberNow) ?? null;
    }

    return item;
  });
}

export function getStats (totalCores: string | undefined, workloadInfos: CoreWorkload[] | undefined) {
  if (!totalCores || !workloadInfos) {
    return { idles: 0, pools: 0, tasks: 0 };
  }

  const { pools, tasks } = workloadInfos.reduce(
    (acc, { info }) => {
      if (info.isTask) {
        acc.tasks += 1;
      } else if (info.isPool) {
        acc.pools += 1;
      }

      return acc;
    },
    { pools: 0, tasks: 0 }
  );
  const idles = Number(totalCores) - (pools + tasks);

  return { idles, pools, tasks };
}

export const createTaskMap = <T extends { task: string }>(items: T[]): Record<number, T> => {
  return (items || []).reduce((acc, item) => {
    acc[Number(item.task)] = item;

    return acc;
  }, {} as Record<number, T>);
};

export const getOccupancyType = (lease: LegacyLease | undefined, reservation: Reservation | undefined, isPool: boolean): CoreTimeTypes => {
  if (isPool) {
    return CoreTimeTypes['On Demand'];
  }

  return reservation ? CoreTimeTypes.Reservation : lease ? CoreTimeTypes.Lease : CoreTimeTypes['Bulk Coretime'];
};
