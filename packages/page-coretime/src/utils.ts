// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerConfigRecord } from '@polkadot/react-hooks/types';
import type { PhaseConfig, PhaseProgress, RegionInfo, SaleDetails, SaleParameters } from './types.js';

import { estimateTime, FirstCycleStart, get, getCurrentRegionStartEndTs, getCurrentSaleNumber } from './utils/index.js';
import { PhaseName } from './types.js';

export function calculateSaleDetails (
  saleNumber: number,
  currentSaleNumber: number,
  latestBlock: number,
  chainName: string,
  regionLength: number,
  saleParams: any
): SaleDetails {
  const blocksPerSaleRelay = get.blocks.relay(regionLength);
  const saleStartBlock = saleParams.currentRegion.start.blocks - blocksPerSaleRelay * (currentSaleNumber - saleNumber);
  const saleEndBlock = saleStartBlock + blocksPerSaleRelay;

  const saleStartTs = get.timeslices.relay(saleStartBlock);
  const saleEndTs = get.timeslices.relay(saleEndBlock);

  const saleStartBlockCoretime = FirstCycleStart[chainName] + get.blocks.coretime((saleNumber) * regionLength);
  const saleEndBlockCoretime = saleStartBlockCoretime + get.blocks.coretime(regionLength);

  const data = {
    coretime: {
      end: { block: saleEndBlockCoretime },
      start: { block: saleStartBlockCoretime }
    },
    date: {
      end: estimateTime(saleEndTs, latestBlock),
      start: estimateTime(saleStartTs, latestBlock)
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

export const constructSubscanQuery = (blockStart: number, blockEnd: number, chainName: string, module = 'broker', call = 'purchase') => {
  const page = 1;
  const pageSize = 25;
  const signed = 'all';
  const baseURL = `https://coretime-${chainName}.subscan.io/extrinsic`;

  return `${baseURL}?page=${page}&time_dimension=block&page_size=${pageSize}&module=${module}&signed=${signed}&call=${call}&block_start=${blockStart}&block_end=${blockEnd}`;
};

export const getSaleParameters = (
  salesInfo: RegionInfo,
  config: Pick<PalletBrokerConfigRecord, 'interludeLength' | 'leadinLength' | 'regionLength'>,
  chainName: string,
  lastCommittedTimeslice: number
): SaleParameters => {
  // The sale is happening on the coretime chain, so we need to convert the timeslices to blocks (40 blocks per timeslice)
  const interludeLengthTs = get.timeslices.coretime(config.interludeLength);
  const leadInLengthTs = get.timeslices.coretime(config.leadinLength);

  const { currentRegionEnd, currentRegionStart } = getCurrentRegionStartEndTs(salesInfo, config);
  const phaseConfig = getPhaseConfiguration(currentRegionStart, config.regionLength, interludeLengthTs, leadInLengthTs, lastCommittedTimeslice);

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

export const getPhaseConfiguration = (
  currentRegionStart: number,
  regionLength: number,
  interludeLengthTs: number,
  leadInLengthTs: number,
  lastCommittedTimeslice: number): PhaseConfig | undefined => {
  const renewalsEndTs = currentRegionStart + interludeLengthTs;
  const priceDiscoveryEndTs = renewalsEndTs + leadInLengthTs;
  const fixedPriceLenght = regionLength - interludeLengthTs - leadInLengthTs;
  const fixedPriceEndTs = priceDiscoveryEndTs + fixedPriceLenght;

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
  lastCommittedTimeslice: number,
  currentRegionStart: number,
  interludeLengthTs: number,
  leadInLengthTs: number,
  regionBegin: number): PhaseProgress[] => {
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
