// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CoreTimeChainConsts, CoreTimeConsts, type LegacyLease, type Reservation } from '@polkadot/react-hooks/types';
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

export function calculateSaleDetails (saleNumber: number, currentSaleNumber: number, currentRegionStart: number, latestBlock: number, chainName: string) {
  // @todo get that from the chain!
  const blocksPerTs = 80;

  const blocksPerSaleRelay = blocksPerTs * 5040;

  console.log('blocksPerSale:', blocksPerSaleRelay);

  const currentSaleStartBlock = currentRegionStart * blocksPerTs;

  console.log('currentSaleStartBlock:', currentSaleStartBlock);

  const saleStartBlock = currentSaleStartBlock - blocksPerSaleRelay * (currentSaleNumber - saleNumber);

  // CORETIME
  const saleStartBlockCoretime = FirstCycleStart[chainName] + (saleNumber) * CoreTimeChainConsts.BlocksPerTimeslice;
  const saleEndBlockCoretime = saleStartBlockCoretime + 5040 * CoreTimeChainConsts.BlocksPerTimeslice;

  console.log('saleStartBlock:', saleStartBlock);

  const saleStartTimeslice = saleStartBlock / blocksPerTs;

  console.log('saleStartTimeslice:', saleStartTimeslice);

  const saleEndBlock = saleStartBlock + blocksPerSaleRelay;

  console.log('saleEndBlock:', saleEndBlock);

  // Calculate timeslices in the sale period
  const timeslicesPerSale = blocksPerSaleRelay / CoreTimeChainConsts.BlocksPerTimeslice;

  console.log('timeslicesPerSale:', timeslicesPerSale);

  // Convert block numbers to approximate dates (optional)
  const saleStartDate = estimateTime(saleStartTimeslice, latestBlock);

  console.log('saleStartDate:', saleStartDate);

  const saleEndDate = estimateTime(saleStartTimeslice + 5040, latestBlock);

  console.log('saleEndDate:', saleEndDate);

  // Output results
  return {
    saleStartBlock,
    saleEndBlock,
    timeslicesPerSale,
    saleStartDate,
    saleEndDate,
    saleStartTimeslice,
    saleEndTimeslice: saleStartTimeslice + 5040,
    coretime: {
      startBlock: saleStartBlockCoretime,
      endBlock: saleEndBlockCoretime
    }
  };
}

export const constructSubscanQuery = (blockStart: number, blockEnd: number, module = 'broker', call = 'purchase') => {
  const page = 1;
  const pageSize = 25;
  const signed = 'all';
  const baseURL = 'https://coretime-polkadot.subscan.io/extrinsic';

  return `${baseURL}?page=${page}&time_dimension=block&page_size=${pageSize}&module=${module}&signed=${signed}&call=${call}&block_start=${blockStart}&block_end=${blockEnd}`;
};

export const getCurrentSaleNumber = (currentRegionEnd, chainName: string, config) =>
  chainName && currentRegionEnd && Math.floor((currentRegionEnd - FirstCycleStart[chainName]) / config.regionLength);

export const getRegionStartEndTs = (saleInfo, config) => {
  return {
    currentRegionEnd: saleInfo.regionEnd - config.regionLength,
    currentRegionStart: saleInfo.regionEnd - config.regionLength * 2
  };
};
