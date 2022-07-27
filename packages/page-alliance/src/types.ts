// Copyright 2017-2022 @polkadot/app-alliance authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletAllianceMemberRole } from '@polkadot/types/lookup';

export interface Member {
  accountId: string;
  role: PalletAllianceMemberRole['type'];
}
