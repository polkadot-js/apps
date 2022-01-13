// Copyright 2017-2022 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BN } from '@polkadot/util';

import { balanceOf } from '../balance';

export const defaultTreasury = {
  burn: new BN(1),
  spendPeriod: new BN(0),
  value: balanceOf(1)
};
