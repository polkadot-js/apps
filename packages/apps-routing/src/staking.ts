// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { ApiPromise } from '@polkadot/api';
import type { PalletStakingExposure } from '@polkadot/types/lookup';
import type { Route } from './types';

import Component from '@polkadot/app-staking';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';
import { assert, BN_ONE } from '@polkadot/util';

const TEST_ADDR = '1ufRSF5gx9Q8hrYoj7KwpzQzDNqLJdbKrFwC6okxa5gtBRd';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    // we need a known Exposure type
    const { others: [{ value, who }], own, total } = api.registry.createType<PalletStakingExposure>(
      unwrapStorageType(api.registry, api.query.staking.erasStakers.creator.meta.type),
      { others: [{ value: BN_ONE, who: TEST_ADDR }], own: BN_ONE, total: BN_ONE }
    );

    assert(total.eq(BN_ONE) && own.eq(BN_ONE) && who.eq(TEST_ADDR) && value.eq(BN_ONE), 'Needs a known Exposure type');
  } catch {
    console.warn('Unable to create known-shape Exposure type, disabling staking route');

    return false;
  }

  try {
    // we need to be able to bond
    api.tx.staking.bond(TEST_ADDR, BN_ONE, { Account: TEST_ADDR });
  } catch {
    console.warn('Unable to create staking bond transaction, disabling staking route');

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
