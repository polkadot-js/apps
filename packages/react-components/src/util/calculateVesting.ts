// Copyright 2017-2026 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BlockNumber } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import { BN_ZERO, bnMin } from '@polkadot/util';

interface VestingSchedule {
  startingBlock: BN;
  endBlock: BN;
  perBlock: BN;
  locked: BN;
  vested: BN;
}

interface RecalculatedVesting {
  vestedBalance: BN;
  vestedClaimable: BN;
  vestingLocked: BN;
}

/**
 * Manually recalculate vesting amounts using the correct block number.
 * This is needed because after Asset Hub migration, vesting schedules use
 * relay chain block numbers, but derive.balances.all calculates using
 * the current chain's block number.
 */
export function recalculateVesting (
  schedules: VestingSchedule[],
  currentBlock: BlockNumber
): RecalculatedVesting {
  let totalVested = BN_ZERO;
  let totalLocked = BN_ZERO;

  for (const schedule of schedules) {
    const { endBlock, locked, perBlock, startingBlock } = schedule;

    // If we haven't reached the start block yet, nothing vested
    if (currentBlock.lt(startingBlock)) {
      totalLocked = totalLocked.add(locked);
      continue;
    }

    // If we've passed the end block, everything is vested
    if (currentBlock.gte(endBlock)) {
      totalVested = totalVested.add(locked);
      continue;
    }

    // We're in the middle of vesting
    // Calculate how many blocks have passed since start
    const blocksPassed = currentBlock.sub(startingBlock);

    // Calculate vested amount: min(blocksPassed * perBlock, locked)
    const vestedAmount = bnMin(blocksPassed.mul(perBlock), locked);

    // Calculate still locked amount
    const stillLocked = locked.sub(vestedAmount);

    totalVested = totalVested.add(vestedAmount);
    totalLocked = totalLocked.add(stillLocked);
  }

  return {
    vestedBalance: totalVested,
    vestedClaimable: totalVested, // Will be adjusted in caller with original offset
    vestingLocked: totalLocked
  };
}
