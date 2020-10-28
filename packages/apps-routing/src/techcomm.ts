// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-tech-comm';

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
