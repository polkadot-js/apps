// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { u32, Vec } from '@polkadot/types';
import type { SpStakingPagedExposureMetadata } from '@polkadot/types/lookup';
import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-staking';
import { ZERO_ACCOUNT } from '@polkadot/react-hooks/useWeight';
import { unwrapStorageType } from '@polkadot/types/util';
import { assert, BN_ONE } from '@polkadot/util';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    // Hide for every Asset Hub chain and for Relay chains which have stakingAhClient storagr
    if (api.query.stakingAhClient || api.tx.stakingRcClient) {
      return false;
    }

    // we need a known Exposure type
    const { nominatorCount, own, pageCount, total } = api.registry.createType<SpStakingPagedExposureMetadata>(
      unwrapStorageType(api.registry, api.query.staking.erasStakersOverview.creator.meta.type),
      { nominatorCount: BN_ONE, own: BN_ONE, pageCount: BN_ONE, total: BN_ONE }
    );

    assert(total && own && nominatorCount && pageCount && total.eq(BN_ONE) && own.eq(BN_ONE), 'Needs a known Exposure type');
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

  // For compatibility - `api.query.staking.ledger` returns `legacyClaimedRewards` instead of `claimedRewards` as of v1.4
  try {
    const v = api.registry.createType<Vec<u32>>(
      unwrapStorageType(api.registry, api.query.staking.claimedRewards.creator.meta.type),
      [0]
    );

    assert(v.eq([0]), 'Needs a legacyClaimedRewards array');
  } catch {
    console.warn('No known legacyClaimedRewards or claimedRewards inside staking ledger, disabling staking route');

    return false;
  }

  return true;
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.staking.erasStakersOverview',
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
