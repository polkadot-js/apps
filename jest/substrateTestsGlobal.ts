// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { StartedTestContainer } from 'testcontainers';

export interface SubstrateTestsGlobal extends NodeJS.Global {
  __SUBSTRATE__: StartedTestContainer;
  // You can declare anything you need.
}
