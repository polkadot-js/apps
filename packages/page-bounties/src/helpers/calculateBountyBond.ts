// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BalanceOf } from '@polkadot/types/interfaces';

import BN from 'bn.js';

export function calculateBountyBond (description: string, depositBase: BalanceOf, depositPerByte: BalanceOf): BN {
  return depositBase.toBn().add(depositPerByte.toBn().muln(countUtf8Bytes(description)));
}

export function countUtf8Bytes (str: string): number {
  return new Blob([str]).size;
}
