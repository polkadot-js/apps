// Copyright 2017-2025 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry } from '@polkadot/types/types';

import { ApiPromise, WsProvider } from '@polkadot/api';
import { Metadata, TypeRegistry } from '@polkadot/types';
import metaStatic from '@polkadot/types-support/metadata/static-substrate';

export function createAugmentedApi (): ApiPromise {
  const registry = new TypeRegistry();
  // FIXME - ref: https://github.com/polkadot-js/apps/pull/11051
  // Adding support for CJS and ESM correctly has caused some build issues.
  // This is a hacky type cast to allow the compiler to be happy.
  const metadata = new Metadata(registry as unknown as Registry, metaStatic);

  registry.setMetadata(metadata);

  const api = new ApiPromise({ provider: new WsProvider('ws://', false), registry: registry as unknown as Registry });

  // eslint-disable-next-line deprecation/deprecation
  api.injectMetadata(metadata, true);

  return api;
}
