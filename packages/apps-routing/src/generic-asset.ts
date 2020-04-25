// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import GenericAsset from '@polkadot/app-generic-asset';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: GenericAsset,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.genericAsset.transfer'
      ]
    },
    icon: 'cubes',
    name: 'generic-asset',
    text: t('nav.generic-asset', 'Generic asset', { ns: 'apps-routing' })
  };
}
