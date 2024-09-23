// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { LegacyLease, RegionInfo, Reservation } from '@polkadot/react-hooks/types';
import type { CoreWorkloadType, CoreWorkplanType, InfoRow } from './types.js';

import { BN } from '@polkadot/util';

import { Occupancy } from './types.js';

const CoreTimeConsts = {
  BlockTime: 6000,
  BlocksPerTimeslice: 80,
  DefaultRegion: 5040
};

function formatDate (date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export const estimateTime = (targetBlock: string | number, latestBlock: number, timestamp: number): string | null => {
  if (!timestamp || !latestBlock || !targetBlock) {
    console.error('Invalid input: one or more inputs are missing');

    return null;
  }

  try {
    const blockTime = new BN(CoreTimeConsts.BlockTime); // Average block time in milliseconds (6 seconds)
    const timeSlice = new BN(CoreTimeConsts.BlocksPerTimeslice);
    const targetBlockBN = new BN(targetBlock).mul(timeSlice);
    const latestBlockBN = new BN(latestBlock);
    const timestampBN = new BN(timestamp);
    const blockDifference = targetBlockBN.sub((latestBlockBN)).abs().mul(blockTime);

    const estTimestamp = targetBlockBN.lt(latestBlockBN)
      ? timestampBN.sub(blockDifference)
      : timestampBN.add(blockDifference);

    return formatDate(new Date(estTimestamp.toNumber()));
  } catch (error) {
    console.error('Error in calculation:', error);

    return null;
  }
};

export function formatRowInfo (data: CoreWorkloadType[] | CoreWorkplanType[], core: number, currentRegion: RegionInfo | undefined, timeslice: number, salesInfo, regionLength = CoreTimeConsts.DefaultRegion): InfoRow[] {
  return data.map((one: CoreWorkloadType | CoreWorkplanType) => {
    const item: InfoRow = { core, maskBits: one?.info?.maskBits, task: one?.info?.task, type: one?.type };
    const blockNumber = timeslice * 80;
    const now = new Date().getTime()

    item.type = one.type;
    let end, start = null

    if (one.type === Occupancy.Lease) {
      const period = Math.floor(one.lastBlock / regionLength);
      end = period * regionLength;
    } else {
      // not :100 about this regionLength offset
      start = currentRegion?.start?.toString() ?? salesInfo?.regionBegin - regionLength;
      end = currentRegion?.end?.toString() ?? salesInfo?.regionEnd - regionLength
    }

    if ('timeslice' in one) {
      start = estimateTime(one.timeslice, blockNumber, now) ?? null;
    }

    item.owner = currentRegion?.owner.toString();
    item.start = start ? estimateTime(start, blockNumber, now) : null;
    item.end = end ? estimateTime(end, blockNumber, now) : null;
    item.endBlock = end ? Number(end) * 80 : null;
  
    return item;
  });
}

export function getStats (totalCores: string | undefined, workloadInfos: CoreWorkloadType[] | CoreWorkloadType | undefined) {
  if (!totalCores || !workloadInfos) {
    return { idles: 0, pools: 0, tasks: 0 };
  }

  const sanitized: CoreWorkloadType[] = Array.isArray(workloadInfos) ? workloadInfos : [workloadInfos];

  const { pools, tasks } = sanitized.reduce(
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

export const getOccupancyType = (lease: LegacyLease | undefined, reservation: Reservation | undefined): Occupancy => {
  return reservation ? Occupancy.Reservation : lease ? Occupancy.Lease : Occupancy['Bulk Coretime'];
};
