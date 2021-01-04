// Copyright 2017-2021 @polkadot/app-democracy authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { VoteThreshold } from '@polkadot/types/interfaces';

import BN from 'bn.js';

import { calcPassing } from '@polkadot/api-derive/democracy/util';
import { BN_ONE, BN_TEN, BN_ZERO } from '@polkadot/util';

interface Approx {
  changeAye: BN;
  changeNay: BN;
}

interface ApproxState {
  votedAye: BN;
  votedNay: BN;
  votedTotal: BN;
}

const ONEMIN = new BN(-1);
const DIVISOR = new BN(2);

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
  const multiplier = direction === 1 ? BN_ONE : ONEMIN;
  const voteChange = change.add(inc);

  // since we allow 0.1 as well, we first multiply by 10, before dividing by the same
  const totalChange = BN_ONE.muln(totalInc * 10).mul(voteChange).div(BN_TEN);

  // return the change, vote with change applied and the total with the same. For the total we don't want
  // to go negative (total votes/turnout), since will do sqrt on it (and negative is non-sensical anyway)
  return [
    voteChange,
    votes.add(multiplier.mul(voteChange)),
    BN.max(BN_ZERO, total.add(multiplier.mul(totalChange)))
  ];
}

// loop changes over aye, using the diffs above, returning when an outcome change is made
function calcChangeAye (threshold: VoteThreshold, sqrtElectorate: BN, { votedAye, votedNay, votedTotal }: ApproxState, isPassing: boolean, changeAye: BN, inc: BN): BN {
  while (true) {
    // if this one is passing, we only adjust the convictions (since it goes down), if it is failing
    // we assume new votes needs to be added, do those at 1x conviction
    const [newChangeAye, newAye, newTotal] = getDiffs(votedAye, votedTotal, changeAye, inc, isPassing ? 0 : 1, isPassing ? -1 : 1);
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
    // if this one is passing, we only adjust the convictions (since it goes down), if it is failing
    // we assume new votes needs to be added, do those at 1x conviction
    // NOTE: We use isPassing here, so it is reversed from what we find in the aye calc
    const [newChangeNay, newNay, newTotal] = getDiffs(votedNay, votedTotal, changeNay, inc, isPassing ? 1 : 0, isPassing ? 1 : -1);
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
      changeAye: state.votedNay.isZero()
        ? BN_ZERO
        : change,
      changeNay: state.votedAye.isZero()
        ? BN_ZERO
        : change
    };
  }

  let changeAye = BN_ZERO;
  let changeNay = BN_ZERO;
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

  // - When the other vote is zero, it is not useful to show the decrease, since it ends up at all
  // - Always ensure that we don't go above max available (generally should be covered by above)
  return {
    changeAye: state.votedNay.isZero()
      ? BN_ZERO
      : isPassing
        ? BN.min(changeAye, state.votedAye)
        : changeAye,
    changeNay: state.votedAye.isZero()
      ? BN_ZERO
      : isPassing
        ? changeNay
        : BN.min(changeNay, state.votedNay)
  };
}
