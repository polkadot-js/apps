// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BlockNumber } from '@polkadot/types/interfaces';
import { BN } from '@polkadot/util';

import { BountyApi } from '../../src/hooks';

export const defaultBountyUpdatePeriod = new BN(100000);

export const defaultBountyApi: BountyApi = {
  acceptCurator: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  approveBounty: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  awardBounty: jest.fn().mockReturnValue('mockAwardExtrinsic') as unknown as SubmittableExtrinsicFunction<'promise'>,
  bestNumber: new BN(1) as BlockNumber,
  bounties: [] as DeriveBounties,
  bountyCuratorDeposit: balanceOf(500000),
  bountyDepositBase: new BN(1),
  bountyUpdatePeriod: defaultBountyUpdatePeriod,
  bountyValueMinimum: new BN(1),
  claimBounty: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  closeBounty: jest.fn().mockReturnValue({ length: 4 }) as unknown as SubmittableExtrinsicFunction<'promise'>,
  dataDepositPerByte: new BN(1),
  extendBountyExpiry: jest.fn().mockReturnValue('mockExtendExtrinsic') as unknown as SubmittableExtrinsicFunction<'promise'>,
  maximumReasonLength: 100,
  proposeBounty: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  proposeCurator: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  unassignCurator: jest.fn().mockReturnValue('mockUnassignExtrinsic') as unknown as SubmittableExtrinsicFunction<'promise'>
};

const defaultBalance = balanceOf(1);

export const mockBountyHooks = {
  balance: defaultBalance,
  bountyApi: defaultBountyApi
};
