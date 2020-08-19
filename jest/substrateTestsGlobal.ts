// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StartedTestContainer } from 'testcontainers';

export interface SubstrateTestsGlobal extends NodeJS.Global {
  __SUBSTRATE__: StartedTestContainer;
  // You can declare anything you need.
}
