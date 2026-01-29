// Copyright 2017-2025 @polkadot/app-runtime authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Codec, DefinitionCallNamed } from '@polkadot/types/types';

export interface Result {
  id: number;
  error?: Error;
  def: DefinitionCallNamed;
  result?: Codec;
}
