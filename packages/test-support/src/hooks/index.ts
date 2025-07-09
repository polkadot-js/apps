// Copyright 2017-2025 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { extractTime } from '@polkadot/util';

import { defaultTreasury } from '../creation/treasury.js';
import { defaultMembers } from '../keyring/addresses.js';

export const mockHooks = {
  blockTime: [50, '', extractTime(1)],
  members: defaultMembers,
  treasury: defaultTreasury
};
