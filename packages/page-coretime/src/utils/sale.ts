// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainConstants, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord } from '@polkadot/react-hooks/types';
import type { ChainName, PhaseConfig, RegionInfo, SaleParameters } from '../types.js';
import type { GetResponse } from './index.js';

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
  currentRegionStartTs: number,
  interludeLengthTs: number,
  leadInLengthTs: number,
  regionBegin: number): ProgressBarSection[] => {
  if (!lastCommittedTimeslice || !currentRegionStartTs || !interludeLengthTs || !leadInLengthTs || !regionBegin) {
    return [];
  }

  const progress = lastCommittedTimeslice - currentRegionStartTs;

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
      total: regionBegin - currentRegionStartTs - interludeLengthTs - leadInLengthTs,
      value: Math.max(progress - interludeLengthTs - leadInLengthTs, 0)
    }
  ];
};

const makeConfig = (startTs: number, endTs: number, get: GetResponse, getDate: (ts: number) => string | null, phaseName?: typeof PhaseName[keyof typeof PhaseName]) => {
  return {
    end: {
      blocks: {
        coretime: get.blocks.coretime(endTs),
        relay: get.blocks.relay(endTs)
      },
      date: getDate(endTs),
      ts: endTs
    },
    name: phaseName ?? '',
    start: {
      blocks: {
        coretime: get.blocks.coretime(startTs),
        relay: get.blocks.relay(startTs)
      },
      date: getDate(startTs),
      ts: startTs
    }

  };
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
  const fixedPriceLengthTs = regionLength - interludeLengthTs - leadInLengthTs;
  const fixedPriceEndTs = priceDiscoveryEndTs + fixedPriceLengthTs;
  const get = createGet(constants);
  const getDate = (ts: number) => estimateTime(ts, get.blocks.relay(lastCommittedTimeslice) ?? 0, constants.relay);

  return {
    config: {
      [PhaseName.FixedPrice]: makeConfig(fixedPriceEndTs, fixedPriceEndTs, get, getDate, PhaseName.FixedPrice),
      [PhaseName.PriceDiscovery]: makeConfig(renewalsEndTs, priceDiscoveryEndTs, get, getDate, PhaseName.PriceDiscovery),
      [PhaseName.Renewals]: makeConfig(currentRegionStart, renewalsEndTs, get, getDate, PhaseName.Renewals)
    },
    currentPhaseName: determinePhaseName(lastCommittedTimeslice, currentRegionStart, interludeLengthTs, leadInLengthTs)
  };
};

export const getSaleParameters = (
  { config, constants, salesInfo }: {salesInfo: RegionInfo, config: Pick<PalletBrokerConfigRecord, 'interludeLength' | 'leadinLength' | 'regionLength'>, constants: ChainConstants},
  chainName: ChainName,
  lastCommittedTimeslice: number,
  chosenSaleNumber?: number
): SaleParameters => {
  // The sale is happening on the coretime chain, so we need to convert the timeslices to blocks (40 blocks per timeslice)
  const get = createGet(constants);
  const interludeLengthTs = get.timeslices.coretime(config.interludeLength);
  const leadInLengthTs = get.timeslices.coretime(config.leadinLength);
  const { currentRegionEndTs, currentRegionStartTs } = getCurrentRegionStartEndTs(salesInfo, config.regionLength);
  const getDate = (ts: number) => estimateTime(ts, get.blocks.relay(lastCommittedTimeslice), constants.relay) || '';

  let regionStartTs = currentRegionStartTs;
  let regionEndTs = currentRegionEndTs;
  const saleNumber = getCurrentSaleNumber(currentRegionEndTs, chainName, config);

  let currentRegionInfo: SaleParameters['currentRegion'];

  if (chosenSaleNumber) {
    const blocksPerSaleRelay = get.blocks.relay(config.regionLength);
    const saleStartBlock = get.blocks.relay(salesInfo.regionBegin) - blocksPerSaleRelay * (saleNumber - chosenSaleNumber - 1);
    const saleEndBlock = saleStartBlock + blocksPerSaleRelay;

    const saleStartTs = get.timeslices.relay(saleStartBlock);
    const saleEndTs = get.timeslices.relay(saleEndBlock);

    const saleStartBlockCoretime = FirstCycleStart.block.coretime[chainName] + get.blocks.coretime((chosenSaleNumber) * config.regionLength);
    const saleEndBlockCoretime = saleStartBlockCoretime + get.blocks.coretime(config.regionLength);

    regionStartTs = currentRegionStartTs + get.blocks.coretime(config.regionLength * (chosenSaleNumber - 1));
    regionEndTs = regionStartTs + get.blocks.coretime(config.regionLength);

    currentRegionInfo = {
      end: {
        blocks: {
          coretime: saleEndBlockCoretime,
          relay: get.blocks.relay(regionEndTs)
        },
        date: getDate(regionEndTs),
        ts: saleEndTs
      },
      start: {
        blocks: {
          coretime: saleStartBlockCoretime,
          relay: get.blocks.relay(regionStartTs)
        },
        date: getDate(regionStartTs),
        ts: saleStartTs
      }
    };
  } else {
    currentRegionInfo = makeConfig(regionStartTs, regionEndTs, get, getDate) as SaleParameters['currentRegion'];
  }

  const phaseConfig = getPhaseConfiguration(
    regionStartTs,
    config.regionLength,
    interludeLengthTs,
    leadInLengthTs,
    lastCommittedTimeslice,
    constants
  );

  return {
    currentRegion: currentRegionInfo,
    interlude: {
      blocks: config.interludeLength,
      ts: interludeLengthTs
    },
    leadin: {
      blocks: config.leadinLength,
      ts: leadInLengthTs
    },
    phaseConfig,
    regionForSale: {
      end: {
        blocks: currentRegionInfo.end.blocks.relay + get.blocks.relay(config.regionLength),
        date: estimateTime(currentRegionInfo.end.ts + config.regionLength, get.blocks.relay(lastCommittedTimeslice), constants.relay),
        ts: currentRegionInfo.start.ts + config.regionLength
      },
      start: {
        blocks: currentRegionInfo.end.blocks.relay,
        date: currentRegionInfo.end.date,
        ts: currentRegionInfo.end.ts
      }
    },
    saleNumber
  };
};
