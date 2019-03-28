import { Routes } from '../types';

import Actors from '@polkadot/joy-actors/index';

export default ([
  {
    Component: Actors,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    i18n: {
      defaultValue: 'Actors'
    },
    icon: 'server', //'server',
    name: 'actors'
  }
] as Routes);
