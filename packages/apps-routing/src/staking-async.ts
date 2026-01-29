// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-staking-async';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    return !!((api.tx.stakingAhClient) || (api.tx.staking && api.tx.stakingRcClient));
  } catch {
    return false;
  }
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [],
      needsApiCheck
    },
    group: 'network',
    icon: 'certificate',
    name: 'staking-async',
    text: t('nav.staking-async', 'Staking Async', { ns: 'apps-routing' })
  };
}
