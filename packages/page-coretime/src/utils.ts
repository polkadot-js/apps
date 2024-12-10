// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0


import {  PhaseConfig, PhaseName, PhaseProgress, RegionInfo, SaleDetails } from './types.js';
import { estimateTime, FirstCycleStart, get, getCurrentSaleNumber, getCurrentRegionStartEndTs } from './utils/index.js';

export function calculateSaleDetails(
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


  const saleStartBlockCoretime = FirstCycleStart[chainName] +  get.blocks.coretime((saleNumber) * regionLength)
  const saleEndBlockCoretime = saleStartBlockCoretime + get.blocks.coretime(regionLength)

  const data = {
    saleNumber,
    relay: {
      start: {
        block: saleStartBlock,
        ts: saleStartTs,
      },
      end: {
        block: saleEndBlock,
        ts: saleEndTs,
      },
    },
    coretime: {
      start: { block: saleStartBlockCoretime },
      end: { block: saleEndBlockCoretime },
    },
    date: {
      start: estimateTime(saleStartTs, latestBlock),
      end: estimateTime(saleEndTs, latestBlock),
    }
  } 
  return data;
}

export const constructSubscanQuery = (blockStart: number, blockEnd: number,chainName: string, module = 'broker', call = 'purchase', ) => {
  const page = 1;
  const pageSize = 25;
  const signed = 'all';
  const baseURL = `https://coretime-${chainName}.subscan.io/extrinsic`;

  return `${baseURL}?page=${page}&time_dimension=block&page_size=${pageSize}&module=${module}&signed=${signed}&call=${call}&block_start=${blockStart}&block_end=${blockEnd}`;
};

export const getSaleParameters = (
  salesInfo: RegionInfo, 
  config: { interludeLength: number; leadinLength: number; regionLength: number }, 
  chainName: string, 
  lastCommittedTimeslice: number) => {
    // The sale is happening on the coretime chain, so we need to convert the timeslices to blocks (40 blocks per timeslice)
  const interludeLengthTs = get.timeslices.coretime(config.interludeLength);
  const leadInLengthTs = get.timeslices.coretime(config.leadinLength);

  const { currentRegionEnd, currentRegionStart } = getCurrentRegionStartEndTs(salesInfo, config);
  const phaseConfig = getPhaseConfiguration(currentRegionStart, config.regionLength, interludeLengthTs, leadInLengthTs, lastCommittedTimeslice);

  const saleNumber = getCurrentSaleNumber(currentRegionEnd, chainName, config);
  return {
    cycleNumber: getCurrentSaleNumber(currentRegionEnd, chainName, config),
    regionNumber: saleNumber - 1,
    leadin: {
      ts: leadInLengthTs,
      blocks: config.leadinLength
    },
    interlude: {
      ts: interludeLengthTs,
      blocks: config.interludeLength
    },
    currentRegion: {
      start: {
        ts: currentRegionStart,
        blocks: get.blocks.relay(currentRegionStart)
      },
      end: {
        ts: currentRegionEnd,
        blocks: get.blocks.relay(currentRegionEnd)
      }
    },
    phaseConfig
  };
};

export const getPhaseConfiguration = (
  currentRegionStart: number,
  regionLength: number,
  interludeLengthTs: number,
  leadInLengthTs: number,
  lastCommittedTimeslice: number): PhaseConfig | undefined => {

    const renewalsEndTs = currentRegionStart + interludeLengthTs
    const priceDiscoveryEndTs = renewalsEndTs + leadInLengthTs
    const fixedPriceLenght = regionLength - interludeLengthTs - leadInLengthTs
    const fixedPriceEndTs = priceDiscoveryEndTs + fixedPriceLenght

  return {
    currentPhaseName: determinePhaseName(lastCommittedTimeslice, currentRegionStart, interludeLengthTs, leadInLengthTs),
    config: {
      [PhaseName.Renewals]: {
        lastTimeslice: renewalsEndTs,
        lastBlock: get.blocks.relay(renewalsEndTs)
      },
      [PhaseName.PriceDiscovery]: {
        lastTimeslice: priceDiscoveryEndTs,
        lastBlock: get.blocks.relay(priceDiscoveryEndTs) 
      },
      [PhaseName.FixedPrice]: {
        lastTimeslice: fixedPriceEndTs,
        lastBlock: get.blocks.relay(fixedPriceEndTs)
      }
    }
  }
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
}

export const getSaleProgress = (
  lastCommittedTimeslice: number, 
  currentRegionStart: number, 
  interludeLengthTs: number, 
  leadInLengthTs: number, 
  regionBegin: number): PhaseProgress[] => {
  const progress = lastCommittedTimeslice - currentRegionStart;

  return [
    {
      value: Math.min(progress, interludeLengthTs),
      total: interludeLengthTs,
      label: PhaseName.Renewals
    },
    {
      value: Math.min(Math.max(progress - interludeLengthTs, 0), leadInLengthTs),
      total: leadInLengthTs,
      label: PhaseName.PriceDiscovery
    },
    {
      value: Math.max(progress - interludeLengthTs - leadInLengthTs, 0),
      total: regionBegin - currentRegionStart - interludeLengthTs - leadInLengthTs,
      label: PhaseName.FixedPrice
    }
  ];
}