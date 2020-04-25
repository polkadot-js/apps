// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Staking from '@polkadot/app-staking';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Staking,
    display: {
      needsApi: [
        ['tx.staking.bond']
      ]
    },
    icon: 'certificate',
    name: 'staking',
    text: t('nav.staking', 'Staking', { ns: 'apps-routing' })
  };
}
