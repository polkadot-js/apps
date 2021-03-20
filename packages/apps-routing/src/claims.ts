// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component, { useCounter } from '@polkadot/app-claims';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.claims.mintClaim'
      ]
    },
    group: 'accounts',
    icon: 'star',
    name: 'claims',
    text: t('nav.claims', 'Claim Tokens', { ns: 'apps-routing' }),
    useCounter
  };
}
