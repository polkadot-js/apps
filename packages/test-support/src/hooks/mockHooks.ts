// Copyright 2017-2021 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { defaultTreasury } from '@polkadot/test-support/creation/treasury/defaults';
import { defaultMembers } from '@polkadot/test-support/keyring/addresses';
import { extractTime } from '@polkadot/util';

export const mockHooks = {
  blockTime: [50, '', extractTime(1)],
  members: defaultMembers,
  treasury: defaultTreasury
};
