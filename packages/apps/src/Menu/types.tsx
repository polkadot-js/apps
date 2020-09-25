// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { IconName } from '@fortawesome/fontawesome-svg-core';
import { Routes } from '@polkadot/apps-routing/types';

import React from 'react';

export interface ItemRoute {
  Modal?: React.ComponentType<any>;
  href?: string;
  icon: IconName;
  name: string;
  text: string;
  useCounter?: () => number | string | null;
}

export interface Group {
  name: string;
  routes: Routes;
}

export type Groups = Record<string, Group>;
