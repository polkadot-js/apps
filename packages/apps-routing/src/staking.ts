// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ExposureT as DarwiniaStakingStructsExposure } from '@darwinia/types/interfaces/darwiniaInject';
import type { TFunction } from 'i18next';
import type { ApiPromise } from '@polkadot/api';
import type { PalletStakingExposure } from '@polkadot/types/lookup';
import type { Route } from './types';

import Component from '@polkadot/app-staking';
import { ZERO_ACCOUNT } from '@polkadot/react-hooks/useWeight';
import { unwrapStorageType } from '@polkadot/types/primitive/StorageKey';
import { assert, BN_ONE } from '@polkadot/util';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    // we need a known Exposure type
    const storageType = unwrapStorageType(api.registry, api.query.staking.erasStakers.creator.meta.type);

    if (storageType.toString() === 'DarwiniaStakingStructsExposure') {
      const { others: [{ ktonBalance, power, ringBalance, who }], ownRingBalance, ownKtonBalance, ownPower, totalPower } = api.registry.createType<DarwiniaStakingStructsExposure>(
        storageType,
        { others: [{ ktonBalance: BN_ONE, power: BN_ONE, ringBalance: BN_ONE, who: TEST_ADDR }], ownKtonBalance: BN_ONE, ownPower: BN_ONE, ownRingBalance: BN_ONE, totalPower: BN_ONE }
      );

      assert(ownRingBalance.eq(BN_ONE) && ownKtonBalance.eq(BN_ONE) && ownPower.eq(BN_ONE) &&
        totalPower.eq(BN_ONE) && who.eq(TEST_ADDR) && ringBalance.eq(BN_ONE) &&
        ktonBalance.eq(BN_ONE) && power.eq(BN_ONE), 'Exposure type may have been changed');

      return true;
    }

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
    api.tx.staking.bond(ZERO_ACCOUNT, BN_ONE, { Account: ZERO_ACCOUNT });
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
    text: t<string>('nav.staking', 'Staking', { ns: 'apps-routing' })
  };
}
