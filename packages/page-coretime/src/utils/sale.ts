// Copyright 2017-2025 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ChainConstants, PalletBrokerConfigRecord, PalletBrokerSaleInfoRecord } from '@polkadot/react-hooks/types';
import type { GetResponse, PhaseConfig, RegionInfo, RelayName, SaleParameters } from '../types.js';

import { type ProgressBarSection } from '@polkadot/react-components/types';
import { BN, formatBalance } from '@polkadot/util';

import { PhaseName } from '../constants.js';
import { createGet, estimateTime, FirstCycleStart, getCurrentRegionStartEndTs } from './index.js';

// We are scaling everything to avoid floating point precision issues.
const SCALE = new BN(10000);

/**
 * Formats a BN value to a human-readable balance string with proper units
 *
 * @param num - The BN value to format
 * @returns A formatted string with the balance value and unit
 */
export const formatBNToBalance = (num: BN) => formatBalance(num, { forceUnit: formatBalance.getDefaults().unit, withAll: true, withUnit: true });

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
  relayName: RelayName,
  config: Pick<PalletBrokerConfigRecord, 'interludeLength' | 'leadinLength' | 'regionLength'>
): number => {
  if (!relayName || !currentRegionEnd) {
    return -1;
  }

  return Math.ceil((currentRegionEnd - FirstCycleStart.timeslice.coretime[relayName]) / config.regionLength);
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
  const getDate = (ts: number) => estimateTime(ts, get.blocks.relay(lastCommittedTimeslice), constants.relay)?.formattedDate ?? null;

  return {
    config: {
      [PhaseName.FixedPrice]: makeConfig(priceDiscoveryEndTs, fixedPriceEndTs, get, getDate, PhaseName.FixedPrice),
      [PhaseName.PriceDiscovery]: makeConfig(renewalsEndTs, priceDiscoveryEndTs, get, getDate, PhaseName.PriceDiscovery),
      [PhaseName.Renewals]: makeConfig(currentRegionStart, renewalsEndTs, get, getDate, PhaseName.Renewals)
    },
    currentPhaseName: determinePhaseName(lastCommittedTimeslice, currentRegionStart, interludeLengthTs, leadInLengthTs)
  };
};

export const getSaleParameters = (
  { config, constants, salesInfo }: {salesInfo: RegionInfo, config: Pick<PalletBrokerConfigRecord, 'interludeLength' | 'leadinLength' | 'regionLength'>, constants: ChainConstants},
  relayName: RelayName,
  lastCommittedTimeslice: number,
  chosenSaleNumber = -1
): SaleParameters => {
  const get = createGet(constants);
  const interludeLengthTs = get.timeslices.coretime(config.interludeLength);
  const leadInLengthTs = get.timeslices.coretime(config.leadinLength);
  let { currentRegionEndTs, currentRegionStartTs } = getCurrentRegionStartEndTs(salesInfo, config.regionLength);
  const getDate = (ts: number) => estimateTime(ts, get.blocks.relay(lastCommittedTimeslice), constants.relay)?.formattedDate ?? null;
  const saleNumber = getCurrentSaleNumber(currentRegionEndTs, relayName, config);

  let currentRegionInfo: SaleParameters['currentRegion'];

  if (chosenSaleNumber !== -1) {
    // A hack for Kusama as one of the sales had an unusual length
    // checked against Subscan historical sales
    if (relayName === 'kusama') {
      const irregularRegionLength = 848;

      if (chosenSaleNumber === 0) {
        currentRegionStartTs = FirstCycleStart.timeslice.coretime[relayName];
        currentRegionEndTs = currentRegionStartTs + config.regionLength;
      } else if (chosenSaleNumber === 1) {
        currentRegionStartTs = FirstCycleStart.timeslice.coretime[relayName] + config.regionLength;
        // that particular sale #2 was only 848 blocks long
        currentRegionEndTs = currentRegionStartTs + irregularRegionLength;
      } else {
        currentRegionStartTs = FirstCycleStart.timeslice.coretime[relayName] + config.regionLength * (chosenSaleNumber - 1) + irregularRegionLength;
        currentRegionEndTs = currentRegionStartTs + config.regionLength;
      }
    } else {
      currentRegionStartTs = FirstCycleStart.timeslice.coretime[relayName] + config.regionLength * chosenSaleNumber;
      currentRegionEndTs = currentRegionStartTs + config.regionLength;
    }

    currentRegionInfo = {
      end: {
        blocks: {
          // the coretime blocks cannot be calculated as historically the regions are not 201,600 blocks long, they deviate from 2,212 to 1,417 blocks
          coretime: 0,
          relay: get.blocks.relay(currentRegionEndTs)
        },
        date: getDate(currentRegionEndTs) ?? '',
        ts: currentRegionEndTs
      },
      start: {
        blocks: {

          coretime: 0,
          relay: get.blocks.relay(currentRegionStartTs)
        },
        date: getDate(currentRegionStartTs) ?? '',
        ts: currentRegionStartTs
      }
    };
  } else {
    currentRegionInfo = makeConfig(currentRegionStartTs, currentRegionEndTs, get, getDate) as SaleParameters['currentRegion'];
  }

  let phaseConfig: PhaseConfig | null = null;

  if (currentRegionEndTs - currentRegionStartTs === config.regionLength) {
    phaseConfig = getPhaseConfiguration(
      currentRegionStartTs,
      config.regionLength,
      interludeLengthTs,
      leadInLengthTs,
      lastCommittedTimeslice,
      constants
    );
  }

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
        blocks: {
          coretime: 0,
          relay: currentRegionInfo.end.blocks.relay + get.blocks.relay(config.regionLength)
        },
        date: estimateTime(currentRegionInfo.end.ts + config.regionLength, get.blocks.relay(lastCommittedTimeslice), constants.relay)?.formattedDate ?? null,
        ts: currentRegionInfo.end.ts + config.regionLength
      },
      start: {
        blocks: {
          coretime: 0,
          relay: currentRegionInfo.end.blocks.relay
        },
        date: currentRegionInfo.end.date,
        ts: currentRegionInfo.end.ts
      }
    },
    saleNumber
  };
};
