// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StartedTestContainer } from 'testcontainers';

export interface SubstrateTestsGlobal extends NodeJS.Global {
  __SUBSTRATE__: StartedTestContainer;
  // You can declare anything you need.
}
