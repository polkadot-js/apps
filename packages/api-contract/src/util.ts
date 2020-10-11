// Copyright 2017-2020 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AnyJson, Codec, Registry, TypeDef } from '@polkadot/types/types';

import { createTypeUnsafe } from '@polkadot/types';

export function formatData (registry: Registry, data: AnyJson, type: TypeDef | undefined): Codec {
  return createTypeUnsafe(registry, type?.type || 'Raw', [data], true);
}
