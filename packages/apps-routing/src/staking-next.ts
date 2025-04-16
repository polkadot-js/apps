// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-staking-next';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    return !!((api.tx.stakingNextAhClient) || (api.tx.staking && api.tx.stakingNextRcClient));
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
    name: 'staking-next',
    text: t('nav.staking-next', 'Staking Next', { ns: 'apps-routing' })
  };
}
