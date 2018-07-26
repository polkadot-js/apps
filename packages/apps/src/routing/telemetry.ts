// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

// import Telemetry from '@polkadot/app-telemetry/index';
import Telemetry from '../../../app-telemetry/src/index';

export default ([
  {
    Component: Telemetry,
    i18n: {
      defaultValue: 'Telemetry'
    },
    icon: 'beer',
    isExact: false,
    isHidden: false,
    name: 'telemetry'
  }
] as Routes);
