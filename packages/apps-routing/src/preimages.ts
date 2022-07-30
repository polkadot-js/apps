// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-preimages';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.preimage.notePreimage',
        // only enable when we have referenda (or ranked would be applicable as
        // well, we basically want to disable on all Gov1 chains)
        'tx.referenda.submit'
      ]
    },
    group: 'governance',
    icon: 'panorama',
    name: 'preimages',
    text: t('nav.preimages', 'Preimages', { ns: 'apps-routing' })
  };
}
