// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component, { useCounter } from '@polkadot/app-fin-comm';

export default function create(t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.financialCommittee.members'
      ],
      needsApiInstances: true
    },
    group: 'governance',
    icon: 'microchip',
    name: 'fincomm',
    text: t('nav.fin-comm', 'Fin. comm.', { ns: 'apps-routing' }),
    useCounter
  };
}
