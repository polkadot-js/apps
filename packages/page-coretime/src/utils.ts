// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CoreTimeConsts, type LegacyLease, type Reservation } from '@polkadot/react-hooks/types';
import { BN } from '@polkadot/util';

import { CoreTimeTypes } from './types.js';

export const FirstCycleStart: Record<string, number> = {
  kusama: 285768,
  polkadot: 282525
};

function formatDate (date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}

/**
   * blockTime = 6000 ms
   * BlocksPerTimeslice = 80
   * Default Regoin = 5040 timeslices
   * TargetBlock = TargetTimeslice * BlocksPerTimeslice
   * Block Time Difference = |TargetBlock - latest Block| * blockTime
   *
   * Estimate timestamp =
   * if targetBlock is before the latestBlock
   *    now minus block time difference
   * else
   *    now plus block time difference
   */
export const estimateTime = (targetTimeslice: string | number, latestBlock: number): string | null => {
  if (!latestBlock || !targetTimeslice) {
    console.error('Invalid input: one or more inputs are missing');

    return null;
  }

  const now = new Date().getTime();

  try {
    const blockTime = new BN(CoreTimeConsts.BlockTime); // Average block time in milliseconds (6 seconds)
    const timeSlice = new BN(CoreTimeConsts.BlocksPerTimeslice);
    const latestBlockBN = new BN(latestBlock);
    const timestampBN = new BN(now);
    const targetBlockBN = new BN(targetTimeslice).mul(timeSlice);
    const blockTimeDifference = targetBlockBN.sub(latestBlockBN).mul(blockTime);
    const estTimestamp = timestampBN.add(blockTimeDifference);

    return formatDate(new Date(estTimestamp.toNumber()));
  } catch (error) {
    console.error('Error in calculation:', error);

    return null;
  }
};

export const getOccupancyType = (lease: LegacyLease | undefined, reservation: Reservation | undefined, isPool: boolean): CoreTimeTypes => {
  if (isPool) {
    return CoreTimeTypes['On Demand'];
  }

  return reservation ? CoreTimeTypes.Reservation : lease ? CoreTimeTypes.Lease : CoreTimeTypes['Bulk Coretime'];
};
