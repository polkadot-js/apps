import { Routes } from '../types';

import Actors from '@polkadot/joy-roles/index';

export default ([
  {
    Component: Actors,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    i18n: {
      defaultValue: 'Roles'
    },
    icon: 'server',
    name: 'roles'
  }
] as Routes);
