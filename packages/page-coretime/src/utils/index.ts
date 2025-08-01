// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainBlockConstants, ChainConstants, CoretimeInformation } from '@polkadot/react-hooks/types';
import type { GetResponse, RegionInfo, RelayName } from '../types.js';

import { CoreTimeTypes } from '@polkadot/react-hooks/constants';
import { BN } from '@polkadot/util';

type FirstCycleStartType = Record<
'block' | 'timeslice',
Record<
'coretime',
Record<RelayName, number>
>
>;

// Blocks on the Coretime Chain
export const FirstCycleStart: FirstCycleStartType = {
  block: {
    coretime: {
      kusama: 53793,
      'paseo testnet': 22316,
      polkadot: 100988,
      westend: 7363
    }
  },
  timeslice: {
    coretime: {
      kusama: 284920,
      'paseo testnet': 38469,
      polkadot: 282525,
      westend: 245402
    }
  }
};

export const coretimeTypeColours: Record<string, string> = {
  [CoreTimeTypes.Reservation]: 'orange',
  [CoreTimeTypes.Lease]: 'blue',
  [CoreTimeTypes['Bulk Coretime']]: 'pink'
};

export function formatDate (date: Date, time = false) {
  const day = date.getDate();
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();

  if (time) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
  }

  return `${day} ${month} ${year}`;
}

/**
 * Gives you a date for the target timeslice
 *
 * Relay chain info:
 * blockTime = 6000 ms
 * BlocksPerTimeslice = 80
 * Default Regoin = 5040 timeslices
 *
 * Calculation:
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
  latestBlock: number,
  { blocksPerTimeslice: blocksPerTs, blocktimeMs }: ChainBlockConstants
): { timestamp: number, formattedDate: string } | null => {
  if (!latestBlock || !targetTimeslice) {
    console.error('Invalid input: one or more inputs are missing');

    return null;
  }

  try {
    const now = new BN(Date.now());
    const blockTime = new BN(blocktimeMs); // Average block time in milliseconds (6 seconds)
    const blocksPerTimeslice = new BN(blocksPerTs);
    const targetBlock = new BN(Number(targetTimeslice)).mul(blocksPerTimeslice);
    const latestBlockBN = new BN(latestBlock);
    const blockDifference = targetBlock.sub(latestBlockBN);
    const timeDifference = blockDifference.mul(blockTime);
    const estTimestamp = now.add(timeDifference);

    return {
      formattedDate: formatDate(new Date(estTimestamp.toNumber())),
      timestamp: estTimestamp.toNumber()
    };
  } catch (error) {
    console.error('Error in calculation:', error);

    return null;
  }
};

/**
 * Factory function to create helper functions for converting timeslices to blocks and vice versa.
 *
 * @returns An object containing blocks and timeslices conversion functions.
 */
export const createGet = (constants: ChainConstants): GetResponse => ({
  blocks: {
    /**
     * Convert timeslices to Coretime blocks.
     *
     * @param ts - Number of timeslices.
     * @returns Number of Coretime blocks.
     */
    coretime: (ts: number) => {
      return ts * constants.coretime.blocksPerTimeslice;
    },
    /**
     * Convert timeslices to Relay blocks.
     *
     * @param ts - Number of timeslices.
     * @returns Number of Relay blocks.
     */
    relay: (ts: number) => {
      return ts * constants.relay.blocksPerTimeslice;
    }
  },
  timeslices: {
    /**
     * Convert Coretime blocks to timeslices.
     *
     * @param blocks - Number of Coretime blocks.
     * @returns Number of timeslices.
     */
    coretime: (blocks: number) => {
      return blocks / constants.coretime.blocksPerTimeslice;
    },
    /**
     * Convert Relay blocks to timeslices.
     *
     * @param blocks - Number of Relay blocks.
     * @returns Number of timeslices.
     */
    relay: (blocks: number) => {
      return blocks / constants.relay.blocksPerTimeslice;
    }
  }
});

/**
 * Get the start and end of the current region
 * broker.saleInfo call returns the start/end of the next region always
 *
 * The end of the current region is the start of the next region, which is returned by broker.saleInfo call
 *
 * @param saleInfo - The sale information
 * @param config - The broker configuration
 *
 * @returns The start and end of the current region
 */
export const getCurrentRegionStartEndTs = (saleInfo: RegionInfo, regionLength: number) => {
  return {
    currentRegionEndTs: saleInfo.regionBegin,
    currentRegionStartTs: saleInfo.regionBegin - regionLength
  };
};

export const getAvailableNumberOfCores = (coretimeInfo: CoretimeInformation) =>
  Number(coretimeInfo?.salesInfo?.coresOffered) - Number(coretimeInfo?.salesInfo.coresSold);

export const constructSubscanQuery = (dateStart: string, dateEnd: string, chainName: string, module = 'broker', call = 'purchase') => {
  const page = 1;
  const pageSize = 25;
  const signed = 'all';
  const baseURL = `https://coretime-${chainName}.subscan.io/extrinsic`;

  return `${baseURL}?page=${page}&time_dimension=date&page_size=${pageSize}&module=${module}&signed=${signed}&call=${call}&date_start=${dateStart}&date_end=${dateEnd}`;
};
