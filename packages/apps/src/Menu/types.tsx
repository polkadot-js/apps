// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '@polkadot/apps-routing/types';

export interface Group {
  name: string;
  routes: Routes;
}

export type Groups = Record<string, Group>;
