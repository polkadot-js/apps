// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubstrateTestsGlobal } from './substrateTestsGlobal';

declare const global: SubstrateTestsGlobal;

export default async (): Promise<void> => {
  console.log('Shutting down Substrate container...');

  await global.__SUBSTRATE__.stop();

  console.log('Done.');
};
