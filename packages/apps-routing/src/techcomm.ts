// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import TechComm from '@polkadot/app-tech-comm';

export default ([
  {
    Component: TechComm,
    display: {
      needsApi: ['query.technicalCommittee.members']
    },
    i18n: {
      defaultValue: 'Tech. committee'
    },
    icon: 'microchip',
    name: 'techcomm'
  }
] as Routes);
