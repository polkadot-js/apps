// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaCurve } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

import { BN_BILLION, BN_ZERO, bnToBn } from '@polkadot/util';

import { curveThreshold } from './util';

function curveLinear (ceil: BN | string | number, floor: BN | string | number, length: BN | string | number): PalletReferendaCurve {
  return {
    asLinearDecreasing: {
      ceil: bnToBn(ceil),
      floor: bnToBn(floor),
      length: bnToBn(length)
    },
    isLinearDecreasing: true,
    isReciprocal: false,
    isSteppedDecreasing: false
  } as PalletReferendaCurve;
}

function curveReciprocal (factor: BN | string | number, xOffset: BN | string | number, yOffset: BN | string | number): PalletReferendaCurve {
  return {
    asReciprocal: {
      factor: bnToBn(factor),
      xOffset: bnToBn(xOffset),
      yOffset: bnToBn(yOffset)
    },
    isLinearDecreasing: false,
    isReciprocal: true,
    isSteppedDecreasing: false
  } as PalletReferendaCurve;
}

// We don't currenbtly have curves on Kusama for this, so needs a check
// function curveStepped (begin: BN | string | number, end: BN | string | number, period: BN | string | number, step: BN | string | number): PalletReferendaCurve {
//   return {
//     asSteppedDecreasing: {
//       begin: bnToBn(begin),
//       end: bnToBn(end),
//       period: bnToBn(period),
//       step: bnToBn(step)
//     },
//     isLinearDecreasing: false,
//     isReciprocal: false,
//     isSteppedDecreasing: true
//   } as PalletReferendaCurve;
// }

function hrsValue (hrs: number): BN {
  return BN_BILLION.muln(hrs).divn(672);
}

function percentValue (percent: number): BN {
  return BN_BILLION.muln(percent).divn(100);
}

describe('curveThreshold', (): void => {
  describe('LinearDecreasing', (): void => {
    // linear support curve from root track on Kusama
    const rootCurve = curveLinear(BN_BILLION.divn(2), BN_ZERO, BN_BILLION);

    it('has a correct starting point', (): void => {
      expect(
        curveThreshold(rootCurve, hrsValue(0)).toString()
      ).toEqual(percentValue(50).toString());
    });

    it('has the correct midpoint', (): void => {
      expect(
        curveThreshold(rootCurve, hrsValue(672 / 2)).toString()
      ).toEqual(percentValue(25).toString());
    });

    it('has a correct ending point', (): void => {
      expect(
        curveThreshold(rootCurve, hrsValue(672)).toString()
      ).toEqual(percentValue(0).toString());
    });
  });

  describe('Reciprocal', (): void => {
    // linear approval curve from root track on Kusama
    const rootCurve = curveReciprocal(222_222_224, 333_333_335, 333_333_332);

    it('has a correct starting point', (): void => {
      expect(
        curveThreshold(rootCurve, hrsValue(0)).toString()
      ).toEqual(percentValue(100).toString());
    });

    it('has the correct midpoints', (): void => {
      expect(
        curveThreshold(rootCurve, hrsValue(12)).toString()
      ).toEqual('966101697'); // 96.61%
      expect(
        curveThreshold(rootCurve, hrsValue(336)).toString()
      ).toEqual(percentValue(60).toString());
    });

    it('has a correct ending point', (): void => {
      expect(
        curveThreshold(rootCurve, hrsValue(672)).toString()
      ).toEqual('499999999');
    });
  });

  // describe('Stepped', (): void => {

  // });
});
