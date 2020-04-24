// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import TechComm, { useCounter } from '@polkadot/app-tech-comm';

const route: Route = {
  Component: TechComm,
  display: {
    needsApi: [
      'query.technicalCommittee.members'
    ]
  },
  i18n: {
    defaultValue: 'Tech. comm.'
  },
  icon: 'microchip',
  name: 'techcomm',
  useCounter
};

export default route;
