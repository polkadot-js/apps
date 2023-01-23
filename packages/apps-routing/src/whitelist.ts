// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-whitelist';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.whitelist.removeWhitelistedCall'
      ]
    },
    group: 'governance',
    icon: 'list-check',
    name: 'whitelist',
    text: t('nav.whitelist', 'Whitelist', { ns: 'apps-routing' })
  };
}
