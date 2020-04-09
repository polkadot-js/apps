// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { VoteThreshold } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { calcPassing } from '@polkadot/api-derive/democracy/util';

interface Approx {
  changeAye: BN;
  changeNay: BN;
}

interface ApproxState {
  votedAye: BN;
  votedNay: BN;
  votedTotal: BN;
}

const ZERO = new BN(0);
const ONE = new BN(1);
const ONEMIN = new BN(-1);
const DIVISOR = new BN(2);
const TEN = new BN(10);

/**
 * This is where we tweak the input values, based on what was specified, be it the input number
 * or the direction and turnout adjustments
 *
 * @param votes The votes that should be adjusted, will be either aye/nay
 * @param total The actual total of applied votes (same as turnout from derived)
 * @param change The actual change value we want to affect
 * @param inc The increment to apply here
 * @param totalInc The increment for the total. 0 for conviction-only changes, 1 of 1x added conviction vote
 * @param direction The direction, either increment (1) or decrement (-1)
 */
function getDiffs (votes: BN, total: BN, change: BN, inc: BN, totalInc: 0 | 0.1 | 1, direction: 1 | -1): [BN, BN, BN] {
  // setup
  const multiplier = direction === 1 ? ONE : ONEMIN;
  const voteChange = change.add(inc);

  // since we allow 0.1 as well, we first multiply by 10, before dividing by the same
  const totalChange = ONE.muln(totalInc * 10).mul(voteChange).div(TEN);

  // return the change, vote with change applied and the total with the same. For the total we don't want
  // to go negative (total votes/turnout), since will do sqrt on it (and negative is non-sensical anyway)
  return [
    voteChange,
    votes.add(multiplier.mul(voteChange)),
    BN.max(ZERO, total.add(multiplier.mul(totalChange)))
  ];
}

// loop changes over aye, using the diffs above, returning when an outcome change is made
function calcChangeAye (threshold: VoteThreshold, sqrtElectorate: BN, { votedAye, votedNay, votedTotal }: ApproxState, isPassing: boolean, changeAye: BN, inc: BN): BN {
  while (true) {
    const [newChangeAye, newAye, newTotal] = getDiffs(votedAye, votedTotal, changeAye, inc, 0, isPassing ? -1 : 1);
    const newResult = calcPassing(threshold, sqrtElectorate, { votedAye: newAye, votedNay, votedTotal: newTotal });

    if (newResult !== isPassing) {
      return changeAye;
    }

    changeAye = newChangeAye;
  }
}

// loop changes over nay, using the diffs above, returning when an outcome change is made
function calcChangeNay (threshold: VoteThreshold, sqrtElectorate: BN, { votedAye, votedNay, votedTotal }: ApproxState, isPassing: boolean, changeNay: BN, inc: BN): BN {
  while (true) {
    const [newChangeNay, newNay, newTotal] = getDiffs(votedNay, votedTotal, changeNay, inc, 0, isPassing ? 1 : -1);
    const newResult = calcPassing(threshold, sqrtElectorate, { votedAye, votedNay: newNay, votedTotal: newTotal });

    if (newResult !== isPassing) {
      return changeNay;
    }

    changeNay = newChangeNay;
  }
}

// The magic happens here
export function approxChanges (threshold: VoteThreshold, sqrtElectorate: BN, state: ApproxState): Approx {
  const isPassing = calcPassing(threshold, sqrtElectorate, state);

  // simple case, we have an aye > nay to determine passing
  if (threshold.isSimplemajority) {
    const change = isPassing
      ? state.votedAye.sub(state.votedNay)
      : state.votedNay.sub(state.votedAye);

    return {
      changeAye: change,
      changeNay: change
    };
  }

  let changeAye = ZERO;
  let changeNay = ZERO;
  let inc = state.votedTotal.div(DIVISOR);

  // - starting from a large increment (total/2) see if that changes the outcome
  // - keep dividing by 2, each time adding just enough to _not_ make the state change
  // - continue the process, until we have the smallest increment
  // - on the last iteration, we add the increment, since we push over the line
  while (!inc.isZero()) {
    // calc the applied changes based on current increment
    changeAye = calcChangeAye(threshold, sqrtElectorate, state, isPassing, changeAye, inc);
    changeNay = calcChangeNay(threshold, sqrtElectorate, state, isPassing, changeNay, inc);

    // move down one level
    const nextInc = inc.div(DIVISOR);

    // on the final round (no more inc reductions), add the last increment to push it over the line
    if (nextInc.isZero()) {
      changeAye = changeAye.add(inc);
      changeNay = changeNay.add(inc);
    }

    inc = nextInc;
  }

  // for the cases where we start at 0, we could have a value slightly higher than available,
  // cleanup, never having more than the max already available to us
  return {
    changeAye: isPassing
      ? BN.min(changeAye, state.votedAye)
      : changeAye,
    changeNay: isPassing
      ? changeNay
      : BN.min(changeNay, state.votedNay)
  };
}
