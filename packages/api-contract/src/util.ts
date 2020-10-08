// Copyright 2017-2020 @polkadot/rpc-core authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Codec, Registry, TypeDef } from '@polkadot/types/types';

import { Raw, createTypeUnsafe } from '@polkadot/types';

export function formatData (registry: Registry, data: Raw, { type }: TypeDef): Codec {
  return createTypeUnsafe(registry, type, [data], true);
}
