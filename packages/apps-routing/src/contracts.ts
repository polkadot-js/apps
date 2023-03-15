// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { ApiPromise } from '@polkadot/api';
import type { Route } from './types.js';

import Component from '@polkadot/app-contracts';
import { assertReturn } from '@polkadot/util';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    // needs storageDepositLimit
    return assertReturn(api.tx.contracts.instantiateWithCode.meta.args.length === 6, 'Invalid args');
  } catch (error) {
    console.warn('Contract interface does not support storageDepositLimit, disabling route');

    return false;
  }
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.contracts.instantiateWithCode'
      ],
      needsApiCheck
    },
    group: 'developer',
    icon: 'compress',
    name: 'contracts',
    text: t<string>('nav.contracts', 'Contracts', { ns: 'apps-routing' })
  };
}
