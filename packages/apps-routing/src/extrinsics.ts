// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-extrinsics';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    group: 'developer',
    icon: 'envelope-open-text',
    name: 'extrinsics',
    text: t<string>('nav.extrinsics', 'Extrinsics', { ns: 'apps-routing' })
  };
}
