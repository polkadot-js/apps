// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-claims';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        // NOTE The functionality is currently non-working - with no way of
        // actually testing changes with test-cases, it falls into the
        // non-fixable bucket
        //
        // Original mintClaim check
        // 'tx.claims.mintClaim'
        'tx.claims.disableForAll'
      ]
    },
    group: 'accounts',
    icon: 'star',
    name: 'claims',
    text: t('nav.claims', 'Claim Tokens', { ns: 'apps-routing' }),
    useCounter
  };
}
