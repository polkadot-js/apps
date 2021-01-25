// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubstrateTestsGlobal } from './substrateTestsGlobal';

declare const global: SubstrateTestsGlobal;

export default async (): Promise<void> => {
  console.log('Shutting down Substrate container...');

  await global.__SUBSTRATE__.stop();

  console.log('Done.');
};
