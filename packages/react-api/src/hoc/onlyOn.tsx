// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ComponentType } from 'react';
import { Environment } from '../types';
import { getEnvironment } from '../util';

const onlyOn = (environment: Environment) => <T extends ComponentType<any>>(component: T): T | (() => null) => {
  if (getEnvironment() === environment) {
    return component;
  }

  return () => null;
};

export const onlyOnWeb = onlyOn('web');
export const onlyOnApp = onlyOn('app');
