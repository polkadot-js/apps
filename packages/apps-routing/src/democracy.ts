// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-democracy';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.democracy.notePreimage'
      ]
    },
    group: 'governance',
    icon: 'calendar-check',
    name: 'democracy',
    text: t<string>('nav.democracy', 'Democracy', { ns: 'apps-routing' }),
    useCounter
  };
}
