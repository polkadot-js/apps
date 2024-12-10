// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from '@polkadot/util';
import { CoreTimeChainConsts, CoreTimeConsts, CoretimeInformation, PalletBrokerConfigRecord } from "@polkadot/react-hooks/types";
import { RegionInfo } from '../types.js';

// Blocks on the Coretime Chain
export const FirstCycleStart: Record<string, number> = {
    kusama: 285768,
    polkadot: 282525
  };


  
export function formatDate(date: Date) {
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'short' });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
}

/**
 * Gives you a date for the traget timeslice
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
export const estimateTime = (targetTimeslice: string | number, latestBlock: number): string | null => {
    if (!latestBlock || !targetTimeslice) {
        console.error('Invalid input: one or more inputs are missing');
        return null;
    }

    try {
        const now = new BN(Date.now());
        const blockTime = new BN(CoreTimeConsts.BlockTime); // Average block time in milliseconds (6 seconds)
        const blocksPerTimeslice = new BN(CoreTimeConsts.BlocksPerTimeslice);
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
 * Get the current sale number
 * 
 * @param currentRegionEnd - The end of the current region
 * @param chainName - The name of the chain
 * @param config - broker.configuration call response
 * 
 * @returns The current sale number
 */
export const getCurrentSaleNumber = (currentRegionEnd: number, chainName: string, config: any) =>
    chainName && currentRegionEnd && Math.floor((currentRegionEnd - FirstCycleStart[chainName]) / config.regionLength);


/**
 * Helper functions to convert timeslices to blocks and vice versa
 */
export const get = {
    blocks: {
        coretime: (ts: number) => {
            return ts * CoreTimeChainConsts.BlocksPerTimeslice;
        },
        relay: (ts: number) => {
            return ts * CoreTimeConsts.BlocksPerTimeslice;
        }
    },
    timeslices: {
        coretime: (blocks: number) => {
            return blocks / CoreTimeChainConsts.BlocksPerTimeslice;
        },
        relay: (blocks: number) => {
            return blocks / CoreTimeConsts.BlocksPerTimeslice;
        }
    }
}

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
export const getCurrentRegionStartEndTs = (saleInfo: RegionInfo, config: PalletBrokerConfigRecord) => {
    return {
      currentRegionEnd: saleInfo.regionBegin,
      currentRegionStart: saleInfo.regionBegin - config.regionLength
    };
}

export const getAvailableNumberOfCores = (coretimeInfo: CoretimeInformation) => 
    Number(coretimeInfo?.salesInfo?.coresOffered) - Number(coretimeInfo?.salesInfo.coresSold);
