import { Routes } from '../types';

import Members from '@polkadot/joy-members/index';

export default ([
  {
    Component: Members,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.membership.firstMemberId',
      ]
    },
    i18n: {
      defaultValue: 'Members'
    },
    icon: 'users',
    name: 'members'
  }
] as Routes);
