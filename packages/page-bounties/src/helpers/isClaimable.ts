// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

export function isClaimable (accounts: string[], beneficiary: AccountId, payoutDue: BN): boolean {
  return payoutDue.ltn(0) && accounts.includes(beneficiary.toString());
}
