// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { ApiPromise } from '@polkadot/api';
import type { Route } from './types';

import Component, { useCounter } from '@polkadot/app-democracy';

function needsApiCheck (api: ApiPromise): boolean {
  try {
    // we need to be able to create an actual vote
    api.tx.democracy.vote(1, { Standard: { balance: 1, vote: { aye: true, conviction: 1 } } });

    return true;
  } catch (error) {
    console.warn('Unable to create referendum vote transaction, disabling democracy route');

    return false;
  }
}

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.democracy.propose'
      ],
      needsApiCheck
    },
    group: 'governance',
    icon: 'calendar-check',
    name: 'democracy',
    text: t('nav.democracy', 'Democracy', { ns: 'apps-routing' }),
    useCounter
  };
}
