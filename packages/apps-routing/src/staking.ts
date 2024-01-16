// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { u32, Vec } from '@polkadot/types';
import type { PalletStakingExposure, PalletStakingStakingLedger } from '@polkadot/types/lookup';
import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-staking';
import { ZERO_ACCOUNT } from '@polkadot/react-hooks/useWeight';
import { unwrapStorageType } from '@polkadot/types/util';
import { assert, BN_ONE } from '@polkadot/util';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    // we need a known Exposure type
    const { others: [{ value, who }], own, total } = api.registry.createType<PalletStakingExposure>(
      unwrapStorageType(api.registry, api.query.staking.erasStakers.creator.meta.type),
      { others: [{ value: BN_ONE, who: ZERO_ACCOUNT }], own: BN_ONE, total: BN_ONE }
    );

    assert(total && own && value && who && total.eq(BN_ONE) && own.eq(BN_ONE) && value.eq(BN_ONE), 'Needs a known Exposure type');
  } catch {
    console.warn('Unable to create known-shape Exposure type, disabling staking route');

    return false;
  }

  try {
    // we need to be able to bond
    if (api.tx.staking.bond.meta.args.length === 3) {
      // previous generation, controller account is required
      // @ts-expect-error Previous generation
      api.tx.staking.bond(ZERO_ACCOUNT, BN_ONE, { Account: ZERO_ACCOUNT });
    } else if (api.tx.staking.bond.meta.args.length === 2) {
      // current, no controller account
      api.tx.staking.bond(BN_ONE, { Account: ZERO_ACCOUNT });
    } else {
      // unknown
      return false;
    }
  } catch {
    console.warn('Unable to create staking bond transaction, disabling staking route');

    return false;
  }

  try {
    const v = api.registry.createType<PalletStakingStakingLedger>(
      unwrapStorageType(api.registry, api.query.staking.ledger.creator.meta.type),
      { claimedRewards: [1, 2, 3] }
    );

    assert((v as unknown as { claimedRewards: Vec<u32> }).claimedRewards.eq([1, 2, 3]), 'Needs a claimedRewards array');
  } catch {
    console.warn('No known claimedRewards inside staking ledger, disabling staking route');

    return false;
  }

  return true;
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.staking.erasStakers',
        'tx.staking.bond'
      ],
      needsApiCheck
    },
    group: 'network',
    icon: 'certificate',
    name: 'staking',
    text: t('nav.staking', 'Staking', { ns: 'apps-routing' })
  };
}
