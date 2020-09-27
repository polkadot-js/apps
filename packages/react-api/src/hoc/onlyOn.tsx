// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
