// Copyright 2017-2026 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Observable } from 'rxjs';
import type { ApiInterfaceRx } from '@polkadot/api/types';
import type { DeriveBalancesAll } from '@polkadot/api-derive/types';
import type { OverrideBundleDefinition } from '@polkadot/types/types';

import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import * as balancesStock from '@polkadot/api-derive/balances';
import { memo } from '@polkadot/api-derive/util';
import { BN, BN_ZERO, bnMax, bnMin, objectSpread } from '@polkadot/util';

// From this runtime on, pallet_vesting schedules are expressed in absolute BABE slots
// instead of block numbers (https://github.com/zkVerify/zkVerify/pull/437)
const SLOT_VESTING_SPEC = 2_001_000;

// Return a shallow copy of result where vesting info is computed from slot numbers, assuming no missed blocks in between.
function updateSlotOnVesting (result: DeriveBalancesAll, slot: BN, bestNumber: BN): DeriveBalancesAll {
  const toBlock = (value: BN) => bnMax(BN_ZERO, value.sub(slot).iadd(bestNumber));
  const vesting = result.vesting.map(({ endBlock, locked, perBlock, startingBlock }) => ({
    endBlock: toBlock(endBlock),
    locked,
    perBlock,
    startingBlock: toBlock(startingBlock),
    vested: slot.gt(startingBlock)
      ? bnMin(locked, perBlock.mul(slot.sub(startingBlock)))
      : BN_ZERO
  }));
  const vestedBalance = vesting.reduce((all, { vested }) => all.iadd(vested), new BN(0));

  return objectSpread({}, result, {
    vestedBalance,
    vestedClaimable: result.isVesting
      ? result.vestingLocked.sub(result.vestingTotal.sub(vestedBalance))
      : BN_ZERO,
    vesting
  });
}

function all (instanceId: string, api: ApiInterfaceRx): (address: string) => Observable<DeriveBalancesAll> {
  const stock = balancesStock.all(instanceId, api);

  return memo(instanceId, (address: string): Observable<DeriveBalancesAll> =>
    api.runtimeVersion.specVersion.ltn(SLOT_VESTING_SPEC) || !api.query.babe?.currentSlot
      ? stock(address)
      : combineLatest([
        stock(address),
        api.query.babe.currentSlot(),
        api.derive.chain.bestNumber()
      ]).pipe(
        map(([result, slot, bestNumber]) => updateSlotOnVesting(result, new BN(slot.toString()), bestNumber))
      )
  );
}

const definitions: OverrideBundleDefinition = {
  derives: {
    balances: {
      ...balancesStock,
      all
    }
  }
};

export default definitions;
