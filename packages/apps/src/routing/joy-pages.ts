import { Routes } from '../types';

import ToS from '@polkadot/joy-pages/ToS';
import Privacy from '@polkadot/joy-pages/Privacy';

export default ([
  {
    Component: ToS,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Terms of Service'
    },
    icon: 'file outline',
    name: 'pages/tos'
  },
  {
    Component: Privacy,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Privacy Policy'
    },
    icon: 'file outline',
    name: 'pages/privacy'
  }
] as Routes);
