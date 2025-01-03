// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainConstants, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord } from '@polkadot/react-hooks/types';
import type { ChainName, PhaseConfig, RegionInfo, SaleDetails, SaleParameters } from '../types.js';

import { type ProgressBarSection } from '@polkadot/react-components/types';
import { BN } from '@polkadot/util';

import { PhaseName } from '../constants.js';
import { createGet, estimateTime, FirstCycleStart, getCurrentRegionStartEndTs } from './index.js';

// We are scaling everything to avoid floating point precision issues.
const SCALE = new BN(10000);

export const leadinFactorAt = (scaledWhen: BN): BN => {
  const scaledHalf = SCALE.div(new BN(2)); // 0.5 scaled to 10000

  if (scaledWhen.lte(scaledHalf)) {
    // First half of the graph, steeper slope
    return SCALE.mul(new BN(100)).sub(scaledWhen.mul(new BN(180)));
  } else {
    // Second half of the graph, flatter slope
    return SCALE.mul(new BN(19)).sub(scaledWhen.mul(new BN(18)));
  }
};

export const getCorePriceAt = (blockNow: number | null, saleInfo: PalletBrokerSaleInfoRecord | undefined): BN => {
  if (!saleInfo || !blockNow) {
    return new BN(0);
  }

  const { endPrice, leadinLength, saleStart } = saleInfo;

  // Explicit conversion to BN
  const blockNowBn = new BN(blockNow);
  const saleStartBn = new BN(saleStart);
  const leadinLengthBn = new BN(leadinLength);

  // Elapsed time since the start of the sale, constrained to not exceed the total lead-in period
  const elapsedTimeSinceSaleStart = blockNowBn.sub(saleStartBn);
  const cappedElapsedTime = elapsedTimeSinceSaleStart.lt(leadinLengthBn)
    ? elapsedTimeSinceSaleStart
    : leadinLengthBn;

  const scaledProgress = cappedElapsedTime.mul(new BN(10000)).div(leadinLengthBn);
  /**
   * Progress is a normalized value between 0 and 1, where:
   *
   * 0 means the sale just started.
   * 1 means the sale is at the end of the lead-in period.
   *
   * We are scaling it to avoid floating point precision issues.
   */
  const leadinFactor = leadinFactorAt(scaledProgress);
  const scaledPrice = leadinFactor.mul(endPrice).div(SCALE);

  return scaledPrice;
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
export const getCurrentSaleNumber = (
  currentRegionEnd: number,
  chainName: ChainName,
  config: Pick<PalletBrokerConfigRecord, 'interludeLength' | 'leadinLength' | 'regionLength'>
): number => {
  if (!chainName || !currentRegionEnd) {
    return -1;
  }

  return Math.ceil((currentRegionEnd - FirstCycleStart.timeslice.coretime[chainName]) / config.regionLength);
};

export const determinePhaseName = (
  lastCommittedTimeslice: number,
  currentRegionStart: number,
  interludeLengthTs: number,
  leadInLengthTs: number): typeof PhaseName[keyof typeof PhaseName] => {
  const progress = lastCommittedTimeslice - currentRegionStart;

  if (progress < interludeLengthTs) {
    return PhaseName.Renewals;
  }

  if (progress < interludeLengthTs + leadInLengthTs) {
    return PhaseName.PriceDiscovery;
  }

  return PhaseName.FixedPrice;
};

export const getSaleProgress = (
  lastCommittedTimeslice: number | undefined,
  currentRegionStart: number,
  interludeLengthTs: number,
  leadInLengthTs: number,
  regionBegin: number): ProgressBarSection[] => {
  if (!lastCommittedTimeslice || !currentRegionStart || !interludeLengthTs || !leadInLengthTs || !regionBegin) {
    return [];
  }

  const progress = lastCommittedTimeslice - currentRegionStart;

  return [
    {
      label: PhaseName.Renewals,
      total: interludeLengthTs,
      value: Math.min(progress, interludeLengthTs)
    },
    {
      label: PhaseName.PriceDiscovery,
      total: leadInLengthTs,
      value: Math.min(Math.max(progress - interludeLengthTs, 0), leadInLengthTs)
    },
    {
      label: PhaseName.FixedPrice,
      total: regionBegin - currentRegionStart - interludeLengthTs - leadInLengthTs,
      value: Math.max(progress - interludeLengthTs - leadInLengthTs, 0)
    }
  ];
};

const getPhaseConfiguration = (
  currentRegionStart: number,
  regionLength: number,
  interludeLengthTs: number,
  leadInLengthTs: number,
  lastCommittedTimeslice: number,
  constants: ChainConstants
): PhaseConfig => {
  const renewalsEndTs = currentRegionStart + interludeLengthTs;
  const priceDiscoveryEndTs = renewalsEndTs + leadInLengthTs;
  const fixedPriceLenght = regionLength - interludeLengthTs - leadInLengthTs;
  const fixedPriceEndTs = priceDiscoveryEndTs + fixedPriceLenght;
  const get = createGet(constants);

  return {
    config: {
      [PhaseName.Renewals]: {
        lastBlock: get.blocks.relay(renewalsEndTs),
        lastTimeslice: renewalsEndTs
      },
      [PhaseName.PriceDiscovery]: {
        lastBlock: get.blocks.relay(priceDiscoveryEndTs),
        lastTimeslice: priceDiscoveryEndTs
      },
      [PhaseName.FixedPrice]: {
        lastBlock: get.blocks.relay(fixedPriceEndTs),
        lastTimeslice: fixedPriceEndTs
      }
    },
    currentPhaseName: determinePhaseName(lastCommittedTimeslice, currentRegionStart, interludeLengthTs, leadInLengthTs)
  };
};

export const getSaleParameters = (
  salesInfo: RegionInfo,
  config: Pick<PalletBrokerConfigRecord, 'interludeLength' | 'leadinLength' | 'regionLength'>,
  chainName: ChainName,
  lastCommittedTimeslice: number,
  constants: ChainConstants
): SaleParameters => {
  // The sale is happening on the coretime chain, so we need to convert the timeslices to blocks (40 blocks per timeslice)
  const get = createGet(constants);
  const interludeLengthTs = get.timeslices.coretime(config.interludeLength);
  const leadInLengthTs = get.timeslices.coretime(config.leadinLength);

  const { currentRegionEnd, currentRegionStart } = getCurrentRegionStartEndTs(salesInfo, config.regionLength);
  const phaseConfig = getPhaseConfiguration(
    currentRegionStart,
    config.regionLength,
    interludeLengthTs,
    leadInLengthTs,
    lastCommittedTimeslice,
    constants
  );

  const saleNumber = getCurrentSaleNumber(currentRegionEnd, chainName, config);

  return {
    currentRegion: {
      end: {
        blocks: get.blocks.relay(currentRegionEnd),
        ts: currentRegionEnd
      },
      start: {
        blocks: get.blocks.relay(currentRegionStart),
        ts: currentRegionStart
      }
    },
    cycleNumber: getCurrentSaleNumber(currentRegionEnd, chainName, config),
    interlude: {
      blocks: config.interludeLength,
      ts: interludeLengthTs
    },
    leadin: {
      blocks: config.leadinLength,
      ts: leadInLengthTs
    },
    phaseConfig,
    regionNumber: saleNumber - 1
  };
};

export function calculateSaleDetails (
  saleNumber: number,
  currentSaleNumber: number,
  latestBlock: number,
  chainName: ChainName,
  regionLength: number,
  saleParams: SaleParameters,
  constants: ChainConstants
): SaleDetails | null {
  if (saleNumber === -1) {
    return null;
  }

  const get = createGet(constants);

  const blocksPerSaleRelay = get.blocks.relay(regionLength);
  const saleStartBlock = saleParams.currentRegion.start.blocks - blocksPerSaleRelay * (currentSaleNumber - saleNumber - 1);
  const saleEndBlock = saleStartBlock + blocksPerSaleRelay;

  const saleStartTs = get.timeslices.relay(saleStartBlock);
  const saleEndTs = get.timeslices.relay(saleEndBlock);

  const saleStartBlockCoretime = FirstCycleStart.block.coretime[chainName] + get.blocks.coretime((saleNumber) * regionLength);
  const saleEndBlockCoretime = saleStartBlockCoretime + get.blocks.coretime(regionLength);

  const data = {
    coretime: {
      end: { block: saleEndBlockCoretime },
      start: { block: saleStartBlockCoretime }
    },
    date: {
      end: estimateTime(saleEndTs, latestBlock, constants.relay),
      start: estimateTime(saleStartTs, latestBlock, constants.relay)
    },
    relay: {
      end: {
        block: saleEndBlock,
        ts: saleEndTs
      },
      start: {
        block: saleStartBlock,
        ts: saleStartTs
      }
    },
    saleNumber
  };

  return data;
}
