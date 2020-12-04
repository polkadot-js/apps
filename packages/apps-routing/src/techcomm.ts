// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import Component, { useCounter } from '@polkadot/app-tech-comm';

import type { Route } from './types';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.technicalCommittee.members'
      ]
    },
    group: 'governance',
    icon: 'microchip',
    name: 'techcomm',
    text: t('nav.tech-comm', 'Tech. comm.', { ns: 'apps-routing' }),
    useCounter
  };
}
