// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Struct } from '@polkadot/types-codec';

export const isEmpty = (struct: Struct) => {
  if (struct.values) {
    for (const v of struct.values()) {
      if (!v.isEmpty) {
        return false;
      }
    }
  }

  return true;
};
