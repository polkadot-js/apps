// Copyright 2017-2024 @polkadot/app-broker authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { CoreWorkload, CoreWorkloadInfo, RegionInfo } from '@polkadot/react-hooks/types';
import type { InfoRow, Occupancy } from './types.js';

import { BN } from '@polkadot/util';

function formatDate (date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

export const estimateTime = (targetBlock: string, latestBlock: number, timestamp: number): string | null => {
  if (!timestamp || !latestBlock || !targetBlock) {
    console.error('Invalid input: one or more inputs are missing');

    return null;
  }

  try {
    const blockTime = new BN(6000); // Average block time in milliseconds (6 seconds)
    const timeSlice = new BN(80);
    const targetBlockBN = new BN(targetBlock).mul(timeSlice);
    const latestBlockBN = new BN(latestBlock);
    const timestampBN = new BN(timestamp);
    const blockDifference = targetBlockBN.sub((latestBlockBN)).abs().mul(blockTime);

    let estTimestamp;

    if (targetBlockBN.lt(latestBlockBN)) {
      estTimestamp = timestampBN.sub(blockDifference);
    } else {
      estTimestamp = timestampBN.add(blockDifference);
    }

    return formatDate(new Date(estTimestamp.toNumber()));
  } catch (error) {
    console.error('Error in calculation:', error);

    return null;
  }
};

export function sortByCore<T extends { core: number }> (dataArray?: T | T[]): T[] {
  if (!dataArray) {
    return [];
  }

  const sanitized = Array.isArray(dataArray) ? dataArray : [dataArray];

  return sanitized.sort((a, b) => a.core - b.core);
}

export function formatWorkInfo (info: CoreWorkloadInfo, core: number, currentRegion: RegionInfo | undefined, timeslice: number, type: Occupancy, lastBlock: number, regionLength = 5040) {
  const infoVec: InfoRow[] = [];
  const item: InfoRow = { core, maskBits: info.maskBits, taskId: info.task };

  if (currentRegion) {
    const start = currentRegion?.start?.toString() ?? 0;
    const end = currentRegion?.end?.toString() ?? 0;
    const blockNumber = timeslice * 80;

    item.start = estimateTime(start, blockNumber, new Date().getTime());
    item.end = estimateTime(end, blockNumber, new Date().getTime());
    item.endBlock = Number(end) * 80;
    item.owner = currentRegion?.owner.toString();
  }

  item.type = type;

  if (lastBlock) {
    const blockNumber = timeslice * 80;
    const period = Math.floor(lastBlock / regionLength);
    const end = period * regionLength;

    item.start = ' - ';
    item.end = estimateTime(end.toString(), blockNumber, new Date().getTime());
    item.endBlock = Number(end) * 80;
  }

  infoVec.push(item);

  return infoVec;
}

export function getStats (totalCores: string | undefined, workloadInfos: CoreWorkload[] | CoreWorkload | undefined) {
  if (!totalCores || !workloadInfos) {
    return { idles: 0, pools: 0, tasks: 0 };
  }

  const sanitized: CoreWorkload[] = Array.isArray(workloadInfos) ? workloadInfos : [workloadInfos];

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
