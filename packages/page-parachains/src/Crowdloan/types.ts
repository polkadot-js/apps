// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TrieIndex } from '@polkadot/types/interfaces';

export interface Contributed {
  accountIds: string[];
  count: number;
  trieIndex: TrieIndex;
}
