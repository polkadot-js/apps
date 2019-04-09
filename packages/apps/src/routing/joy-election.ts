import { Routes } from '../types';

import Election from '@polkadot/joy-election/index';

export default ([
  {
    Component: Election,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.council.activeCouncil',
      ]
    },
    i18n: {
      defaultValue: 'Council'
    },
    icon: 'university',
    name: 'council'
  }
] as Routes);
