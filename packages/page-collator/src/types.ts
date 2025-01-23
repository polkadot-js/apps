// Copyright 2017-2025 @polkadot/app-collator authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface Collator {
  accountId: string;
  deposit?: BN;
  isInvulnerable: boolean;
  lastBlock?: BN;
}
