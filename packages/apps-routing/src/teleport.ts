// Copyright 2017-2021 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Modal from '@polkadot/app-parachains/Teleport';

export default function create (t: TFunction): Route {
  return {
    Component: Modal,
    Modal,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        [
          'tx.xcm.teleportAssets',
          'tx.xcmPallet.teleportAssets',
          'tx.polkadotXcm.teleportAssets'
        ]
      ],
      needsTeleport: true
    },
    group: 'accounts',
    icon: 'share-square',
    name: 'teleport',
    text: t('nav.teleport', 'Teleport', { ns: 'apps-routing' })
  };
}
