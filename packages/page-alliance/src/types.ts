// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAllianceCid, PalletAllianceMemberRole } from '@polkadot/types/lookup';
import type { BN } from '@polkadot/util';

export interface Cid {
  cid: PalletAllianceCid;
  ipfs: string | null;
  key: string;
}

export interface Member {
  accountId: string;
  role: PalletAllianceMemberRole['type'];
}

export interface MemberInfo {
  accountId: string;
  deposit?: BN | null;
  isUpForKicking: boolean;
}

export interface Rule {
  cid: Cid | null;
  hasRule: boolean;
}

export interface Unscrupulous {
  accounts: string[];
  websites: string[];
}
