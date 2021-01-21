// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { BountyApi } from '@polkadot/app-bounties/hooks';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BlockNumber } from '@polkadot/types/interfaces';

export const defaultBountyApi: BountyApi = {
  approveBounty: jest.fn(),
  bestNumber: new BN(1) as BlockNumber,
  bounties: [] as DeriveBounties,
  bountyDepositBase: new BN(1),
  bountyValueMinimum: new BN(1),
  claimBounty: jest.fn(),
  closeBounty: jest.fn(),
  dataDepositPerByte: new BN(1),
  extendBountyExpiry: jest.fn().mockReturnValue('mockProposeExtrinsic'),
  maximumReasonLength: 100,
  proposeBounty: jest.fn(),
  proposeCurator: jest.fn()
};

export const defaultBalance = balanceOf(1);

export const defaultTreasury = {
  burn: new BN(1),
  spendPeriod: new BN(0),
  value: balanceOf(1)
};

export const defaultMembers = { isMember: true };

export const defaultAccounts = { allAccounts: ['5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM'] };
