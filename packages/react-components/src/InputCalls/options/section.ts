// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DefinitionCallNamed } from '@polkadot/types/types';
import type { DropdownOptions } from '../../util/types.js';

export default function createOptions (runtime: Record<string, Record<string, DefinitionCallNamed>>): DropdownOptions {
  return Object
    .keys(runtime)
    .filter((s) => !s.startsWith('$'))
    .sort()
    .filter((s) => Object.keys(runtime[s]).length !== 0)
    .map((value): { text: string; value: string } => ({
      text: value,
      value
    }));
}
