// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { PalletConvictionVotingTally, PalletRankedCollectiveTally, PalletReferendaCurve, PalletReferendaReferendumInfoConvictionVotingTally, PalletReferendaReferendumInfoRankedCollectiveTally, PalletReferendaTrackInfo } from '@polkadot/types/lookup';
import type { CurveGraph, TrackInfo } from './types';

import { getGovernanceTracks } from '@polkadot/apps-config';
import { BN, BN_BILLION, BN_ONE, BN_ZERO, bnMax, bnMin, formatNumber, stringPascalCase } from '@polkadot/util';

const CALC_CURVE_LENGTH = 100;

export function getTrackName (trackId: BN, { name }: PalletReferendaTrackInfo): string {
  return `${
    formatNumber(trackId)
  } / ${
    name
      .replace(/_/g, ' ')
      .split(' ')
      .map(stringPascalCase)
      .join(' ')
  }`;
}

export function getTrackInfo (api: ApiPromise, specName: string, palletReferenda: string, tracks?: [BN, PalletReferendaTrackInfo][], trackId?: number): TrackInfo | undefined {
  let info: TrackInfo | undefined;

  if (tracks && trackId !== undefined) {
    const originMap = getGovernanceTracks(api, specName, palletReferenda);
    const trackInfo = tracks.find(([id]) => id.eqn(trackId));

    if (trackInfo && originMap) {
      const trackName = trackInfo[1].name.toString();

      info = originMap.find(({ id, name }) =>
        id === trackId &&
        name === trackName
      );
    }
  }

  return info;
}

export function isConvictionTally (tally: PalletRankedCollectiveTally | PalletConvictionVotingTally): tally is PalletConvictionVotingTally {
  return !!(tally as PalletConvictionVotingTally).support && !(tally as PalletRankedCollectiveTally).bareAyes;
}

export function isConvictionVote (info: PalletReferendaReferendumInfoConvictionVotingTally | PalletReferendaReferendumInfoRankedCollectiveTally): info is PalletReferendaReferendumInfoConvictionVotingTally {
  return info.isOngoing && isConvictionTally(info.asOngoing.tally);
}

export function curveThreshold (curve: PalletReferendaCurve, input: BN, div: BN): BN {
  // if divisor is zero, we return the max
  if (div.isZero()) {
    return BN_BILLION;
  }

  const x = input.mul(BN_BILLION).div(div);

  if (curve.isLinearDecreasing) {
    const { ceil, floor, length } = curve.asLinearDecreasing;

    // *ceil - (x.min(*length).saturating_div(*length, Down) * (*ceil - *floor))
    // NOTE: We first multiply, then divide (since we work with fractions)
    return ceil.sub(
      bnMin(x, length)
        .mul(ceil.sub(floor))
        .div(length)
    );
  } else if (curve.isSteppedDecreasing) {
    const { begin, end, period, step } = curve.asSteppedDecreasing;

    // (*begin - (step.int_mul(x.int_div(*period))).min(*begin)).max(*end)
    return bnMax(
      end,
      begin.sub(
        bnMin(
          begin,
          step
            .mul(x)
            .div(period)
        )
      )
    );
  } else if (curve.asReciprocal) {
    const { factor, xOffset, yOffset } = curve.asReciprocal;

    // factor
    //   .checked_rounding_div(FixedI64::from(x) + *x_offset, Low)
    //   .map(|yp| (yp + *y_offset).into_clamped_perthing())
    //   .unwrap_or_else(Perbill::one)
    return bnMin(
      BN_BILLION,
      factor
        .mul(BN_BILLION)
        .div(x.add(xOffset))
        .add(yOffset)
    );
  }

  throw new Error(`Unknown curve found ${curve.type}`);
}

export function curveDelay (curve: PalletReferendaCurve, input: BN, div: BN): BN {
  // if divisor is zero, we return the max
  if (div.isZero()) {
    return BN_BILLION;
  }

  const y = input.mul(BN_BILLION).div(div);

  if (curve.isLinearDecreasing) {
    const { ceil, floor, length } = curve.asLinearDecreasing;

    // if y < *floor {
    //   Perbill::one()
    // } else if y > *ceil {
    //   Perbill::zero()
    // } else {
    //   (*ceil - y).saturating_div(*ceil - *floor, Up).saturating_mul(*length)
    // }
    return y.lt(floor)
      ? BN_BILLION
      : y.gt(ceil)
        ? BN_ZERO
        : bnMin(
          BN_BILLION,
          bnMax(
            BN_ZERO,
            ceil
              .sub(y)
              .mul(length)
              .div(ceil.sub(floor))
          )
        );
  } else if (curve.isSteppedDecreasing) {
    const { begin, end, period, step } = curve.asSteppedDecreasing;

    // if y < *end {
    //   Perbill::one()
    // } else {
    //   period.int_mul((*begin - y.min(*begin) + step.less_epsilon()).int_div(*step))
    // }
    return y.lt(end)
      ? BN_BILLION
      : bnMin(
        BN_BILLION,
        bnMax(
          BN_ZERO,
          period
            .mul(
              begin
                .sub(bnMin(y, begin))
                .add(
                  step.isZero()
                    ? step
                    : step.sub(BN_ONE)
                )
            )
            .div(step)
        )
      );
  } else if (curve.asReciprocal) {
    const { factor, xOffset, yOffset } = curve.asReciprocal;

    // let y = FixedI64::from(y);
    // let maybe_term = factor.checked_rounding_div(y - *y_offset, High);
    // maybe_term
    //   .and_then(|term| (term - *x_offset).try_into_perthing().ok())
    //   .unwrap_or_else(Perbill::one)
    return bnMin(
      BN_BILLION,
      bnMax(
        BN_ZERO,
        factor
          .mul(BN_BILLION)
          .div(y.sub(yOffset))
          .sub(xOffset)
      )
    );
  }

  throw new Error(`Unknown curve found ${curve.type}`);
}

export function calcDecidingEnd (totalEligible: BN, tally: PalletRankedCollectiveTally | PalletConvictionVotingTally, { decisionPeriod, minApproval, minSupport }: PalletReferendaTrackInfo, since: BN): BN | undefined {
  const support = isConvictionTally(tally)
    ? tally.support
    : tally.bareAyes;

  return since.add(
    decisionPeriod
      .mul(
        bnMax(
          curveDelay(minApproval, tally.ayes, tally.ayes.add(tally.nays)),
          curveDelay(minSupport, support, totalEligible)
        )
      )
      .div(BN_BILLION)
  );
}

export function calcCurves ({ decisionPeriod, minApproval, minSupport }: PalletReferendaTrackInfo): CurveGraph {
  const approval = new Array<BN>(100);
  const support = new Array<BN>(100);
  const x = new Array<BN>(100);
  const current = new BN(0);
  const step = decisionPeriod.divn(CALC_CURVE_LENGTH);
  const last = CALC_CURVE_LENGTH - 1;

  for (let i = 0; i < last; i++) {
    approval[i] = curveThreshold(minApproval, current, decisionPeriod);
    support[i] = curveThreshold(minSupport, current, decisionPeriod);
    x[i] = current;

    current.iadd(step);
  }

  // since we may be lossy with the step, we explicitly calc the final point at 100%
  approval[last] = curveThreshold(minApproval, decisionPeriod, decisionPeriod);
  support[last] = curveThreshold(minSupport, decisionPeriod, decisionPeriod);
  x[last] = decisionPeriod;

  return { approval, support, x };
}
