// Copyright 2017-2023 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Metadata, TypeRegistry } from '@polkadot/types';
import metaStatic from '@polkadot/types-support/metadata/static-substrate';

export function createAugmentedApi (): ApiPromise {
  const registry = new TypeRegistry();
  const metadata = new Metadata(registry, metaStatic);

  registry.setMetadata(metadata);

  const api = new ApiPromise({ provider: new WsProvider('ws://', false), registry });

  // eslint-disable-next-line deprecation/deprecation
  api.injectMetadata(metadata, true);

  return api;
}
