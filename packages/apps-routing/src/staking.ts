// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

// import Staking from '@polkadot/app-staking';
import Staking, { useCounter } from '@polkadot/app-staking';

const route: Route = {
  Component: Staking,
  display: {
    needsApi: [
      ['tx.staking.bond']
    ]
  },
  i18n: {
    defaultValue: 'Staking'
  },
  icon: 'certificate',
  name: 'staking',
  useCounter
};

export default route;
