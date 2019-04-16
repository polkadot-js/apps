import { Routes } from '../types';

import Media from '@polkadot/joy-media/index';

export default ([
  {
    Component: Media,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Media'
    },
    icon: 'play circle outline',
    name: 'media'
  }
] as Routes);
