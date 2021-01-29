// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BlockNumber } from '@polkadot/types/interfaces';

import { BountyApi } from '../../src/hooks';

export const defaultBountyUpdatePeriod = new BN(100000);

export const defaultBountyApi: BountyApi = {
  acceptCurator: jest.fn(),
  approveBounty: jest.fn(),
  awardBounty: jest.fn().mockReturnValue('mockAwardExtrinsic'),
  bestNumber: new BN(1) as BlockNumber,
  bounties: [] as DeriveBounties,
  bountyDepositBase: new BN(1),
  bountyUpdatePeriod: defaultBountyUpdatePeriod,
  bountyValueMinimum: new BN(1),
  claimBounty: jest.fn(),
  closeBounty: jest.fn().mockReturnValue({ length: 4 }),
  dataDepositPerByte: new BN(1),
  extendBountyExpiry: jest.fn().mockReturnValue('mockExtendExtrinsic'),
  maximumReasonLength: 100,
  proposeBounty: jest.fn(),
  proposeCurator: jest.fn(),
  unassignCurator: jest.fn().mockReturnValue('mockUnassignExtrinsic')
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
