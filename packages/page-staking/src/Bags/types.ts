// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBagsListListNode } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface StashNode {
  stashId: string;
  node: PalletBagsListListNode;
}

export interface ListNode {
  bonded: BN;
  index: number;
  jump: string | null;
  stashId: string;
}
