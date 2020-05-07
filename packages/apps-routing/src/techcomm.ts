// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import TechComm, { useCounter } from '@polkadot/app-tech-comm';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: TechComm,
    display: {
      needsApi: [
        'query.technicalCommittee.members'
      ]
    },
    icon: 'microchip',
    name: 'techcomm',
    text: t('nav.tech-comm', 'Tech. comm.', { ns: 'apps-routing' }),
    useCounter
  };
}
