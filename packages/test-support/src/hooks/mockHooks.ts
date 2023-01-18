// Copyright 2017-2023 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { extractTime } from '@polkadot/util';

import { defaultTreasury } from '../creation/treasury/defaults';
import { defaultMembers } from '../keyring/addresses';

export const mockHooks = {
  blockTime: [50, '', extractTime(1)],
  members: defaultMembers,
  treasury: defaultTreasury
};
