// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export const isClaimable = (accounts: string[], beneficiary: string, payoutDue: BN): boolean => {
  return payoutDue.ltn(0) ? accounts.includes(beneficiary) : false;
};
