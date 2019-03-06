import { Routes } from '../types';

import Help from '@polkadot/joy-help/index';

export default ([
  {
    Component: Help,
    display: {},
    i18n: {
      defaultValue: 'Help and News'
    },
    icon: 'question circle outline',
    name: 'help'
  }
] as Routes);
