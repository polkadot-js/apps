// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import GenericAsset from '@polkadot/app-generic-asset';
import GenericAssetModal from '@polkadot/app-generic-asset/modal';

export default ([
  {
    Component: GenericAsset,
    Modal: GenericAssetModal,
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
    icon: 'send',
    name: 'generic-asset'
  }
] as Routes);
