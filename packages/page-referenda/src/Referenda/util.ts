// Copyright 2017-2025 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaDeposit } from '@polkadot/types/lookup';
import type { Referendum } from '../types.js';

import { Option } from '@polkadot/types';

export function unwrapDeposit (value: PalletReferendaDeposit | Option<PalletReferendaDeposit>): PalletReferendaDeposit | null {
  return value instanceof Option
    ? value.unwrapOr(null)
    : value;
}

export function getNumDeciding (referenda?: Referendum[]): number {
  if (!referenda) {
    return 0;
  }

  return referenda.filter(({ info }) =>
    info.isOngoing &&
    info.asOngoing.deciding.isSome
  ).length;
}
