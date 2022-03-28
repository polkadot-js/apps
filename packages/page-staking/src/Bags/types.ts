// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletBagsListListNode } from '@polkadot/types/lookup';

export interface StashNode {
  stashId: string;
  node: PalletBagsListListNode;
}
