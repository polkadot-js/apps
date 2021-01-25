// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Metadata } from '@polkadot/metadata';
import metaStatic from '@polkadot/metadata/static';
import { TypeRegistry } from '@polkadot/types/create';

export function createAugmentedApi (): ApiPromise {
  const registry = new TypeRegistry();
  const metadata = new Metadata(registry, metaStatic);

  registry.setMetadata(metadata);

  const api = new ApiPromise({ provider: new WsProvider('ws://', false), registry });

  api.injectMetadata(metadata, true);

  return api;
}
