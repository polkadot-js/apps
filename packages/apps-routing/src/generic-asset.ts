// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import GenericAsset from '@polkadot/app-generic-asset';

const route: Route = {
  Component: GenericAsset,
  display: {
    isHidden: false,
    needsAccounts: true,
    needsApi: [
      'tx.genericAsset.transfer'
    ]
  },
  i18n: {
    defaultValue: 'Generic Asset'
  },
  icon: 'cubes',
  name: 'generic-asset'
};

export default route;
