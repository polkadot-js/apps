// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { BountyApi } from '@polkadot/app-bounties/hooks';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BlockNumber } from '@polkadot/types/interfaces';

export const defaultBountyApi: BountyApi = {
  acceptCurator: jest.fn(),
  approveBounty: jest.fn(),
  bestNumber: new BN(1) as BlockNumber,
  bounties: [] as DeriveBounties,
  bountyDepositBase: new BN(1),
  bountyValueMinimum: new BN(1),
  claimBounty: jest.fn(),
  closeBounty: jest.fn().mockReturnValue({ length: 4 }),
  dataDepositPerByte: new BN(1),
  extendBountyExpiry: jest.fn().mockReturnValue('mockProposeExtrinsic'),
  maximumReasonLength: 100,
  proposeBounty: jest.fn(),
  proposeCurator: jest.fn(),
  unassignCurator: jest.fn()
};

export const defaultBalance = balanceOf(1);

export const defaultTreasury = {
  burn: new BN(1),
  spendPeriod: new BN(0),
  value: balanceOf(1)
};

export const alice = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
export const bob = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';
export const ferdie = '5CiPPseXPECbkjWCa6MnjNokrgYjMqmKndv2rSnekmSK2DjL';
export const defaultCurator = '5C4hrfjw9DjXZTzV3MwzrrAr9P1MJhSrvWGWqi1eSuyUpnhM';

export const defaultMembers = { isMember: true, members: [alice, bob, ferdie] };

export const defaultAccounts = { allAccounts: [defaultCurator] };
