// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Template from '@polkadot/app-123code/index';

export default ([
  {
    Component: Template,
    i18n: {
      defaultValue: 'Template'
    },
    icon: 'th',
    isApiGated: true,
    isHidden: true,
    name: '123code'
  }
] as Routes);
