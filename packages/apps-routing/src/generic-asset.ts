// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component from '@polkadot/app-generic-asset';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.genericAsset.transfer'
      ]
    },
    group: 'network',
    icon: 'cubes',
    name: 'generic-asset',
    text: t('nav.generic-asset', 'Generic asset', { ns: 'apps-routing' })
  };
}
