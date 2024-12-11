// Copyright 2017-2024 @polkadot/app-coretime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBrokerSaleInfoRecord } from '@polkadot/react-hooks/types';

import { BN } from '@polkadot/util';

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

export const getCorePriceAt = (blockNow: number, saleInfo: PalletBrokerSaleInfoRecord): BN => {
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
