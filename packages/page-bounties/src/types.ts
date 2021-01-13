// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, BlockNumber } from '@polkadot/types/interfaces/runtime';

export interface BountyStatusType {
  beneficiary: AccountId | undefined;
  bountyStatus: string;
  curator: AccountId | undefined;
  unlockAt: BlockNumber | undefined;
  updateDue: BlockNumber | undefined;
}
