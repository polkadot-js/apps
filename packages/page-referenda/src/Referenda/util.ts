// Copyright 2017-2022 @polkadot/app-referenda authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { PalletReferendaDeposit } from '@polkadot/types/lookup';

import { Option } from '@polkadot/types';

export function unwrapDeposit (value: PalletReferendaDeposit | Option<PalletReferendaDeposit>): PalletReferendaDeposit | null {
  return value instanceof Option
    ? value.unwrapOr(null)
    : value;
}
