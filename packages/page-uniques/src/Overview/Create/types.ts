// Copyright 2017-2022 @polkadot/app-uniques authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
   
export interface InfoState {
  accountId: string;
  uniqueId: BN;
  data: string;
  isFrozen: boolean;
}

export interface TeamState {
  adminId: string;
  issuerId: string;
  freezerId: string;
}
