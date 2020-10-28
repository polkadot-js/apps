// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-council';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        [
          'query.electionsPhragmen.candidates',
          'query.elections.candidates'
        ]
      ]
    },
    group: 'governance',
    icon: 'building',
    name: 'council',
    text: t('nav.council', 'Council', { ns: 'apps-routing' }),
    useCounter
  };
}
