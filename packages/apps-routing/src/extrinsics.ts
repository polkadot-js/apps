// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-extrinsics';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
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
