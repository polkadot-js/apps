// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-fellowship';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.fellowshipCollective.vote',
        'tx.fellowshipReferenda.submit'
      ]
    },
    group: 'governance',
    icon: 'people-arrows',
    name: 'fellowship',
    text: t('nav.fellowship', 'Fellowship', { ns: 'apps-routing' })
  };
}
