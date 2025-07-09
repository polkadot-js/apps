// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBagsListListBag, PalletBagsListListNode } from '@polkadot/types/lookup';
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

export interface BagInfo {
  bagLower: BN;
  bagUpper: BN;
  index: number;
  info: PalletBagsListListBag;
  key: string;
}

export type BagMap = Record<string, StashNode[]>;
