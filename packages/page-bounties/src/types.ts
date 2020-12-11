// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BlockNumber } from '@polkadot/types/interfaces/runtime';

export interface BountyStatusType {
  beneficiary: string | undefined;
  bountyStatus: string;
  curator: AccountId | undefined;
  unlockAt: number | undefined;
  updateDue: BlockNumber | undefined;
}
