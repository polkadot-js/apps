// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-files';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    group: 'developer',
    icon: 'file',
    name: 'files',
    text: t('nav.files', 'Files (IPFS)', { ns: 'apps-routing' })
  };
}
