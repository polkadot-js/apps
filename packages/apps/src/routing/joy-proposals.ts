import { Routes } from '../types';

import Proposals from '@polkadot/joy-proposals/index';

export default ([
  {
    Component: Proposals,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.proposals.proposalCount',
      ]
    },
    i18n: {
      defaultValue: 'Proposals'
    },
    icon: 'tasks',
    name: 'proposals'
  }
] as Routes);
