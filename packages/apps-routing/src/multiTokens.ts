// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-multi-tokens';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.multiTokens.createCollection'
      ]
    },
    group: 'network',
    icon: 'shopping-cart',
    name: 'multi-tokens',
    text: t('nav.multi-tokens', 'Multi Tokens', { ns: 'apps-routing' })
  };
}
