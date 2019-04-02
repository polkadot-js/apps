import { Routes } from '../types';

import Roles from '@polkadot/joy-roles/index';

export default ([
  {
    Component: Roles,
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
