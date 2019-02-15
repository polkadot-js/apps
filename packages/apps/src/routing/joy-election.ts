import { Routes } from '../types';

import Election from '@polkadot/joy-election/index';

export default ([
  {
    Component: Election,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    i18n: {
      defaultValue: 'Election'
    },
    icon: 'university',
    name: 'election'
  }
] as Routes);
