// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import LandingPage from '@cennznet/app-landing';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';

export default ([
  {
    Component: LandingPage,
    display: {
      isHidden: false
    },
    i18n: {
      defaultValue: 'Getting started'
    },
    icon: faInfoCircle,
    name: 'landing',
    isAdvanced: false
  }
] as Routes);
