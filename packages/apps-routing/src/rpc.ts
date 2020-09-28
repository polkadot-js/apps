// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-rpc';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'developer',
    icon: 'network-wired',
    name: 'rpc',
    text: t<string>('nav.rpc', 'RPC calls', { ns: 'apps-routing' })
  };
}
