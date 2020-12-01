// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import Component from '@polkadot/app-poll';

import type { Route } from './types';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.poll.vote'
      ]
    },
    group: 'governance',
    icon: 'podcast',
    name: 'poll',
    text: t('nav.poll', 'Token poll', { ns: 'apps-routing' })
  };
}
