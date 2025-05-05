// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

/* global jest */

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { BountyApi } from '../../src/hooks/index.js';

import { balanceOf } from '@polkadot/test-support/creation/balance';
import { BN, BN_ONE } from '@polkadot/util';

export const defaultBountyUpdatePeriod = new BN(100000);

export const defaultBountyApi: BountyApi = {
  acceptCurator: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  approveBounty: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  awardBounty: jest.fn(() => 'mockAwardExtrinsic') as unknown as SubmittableExtrinsicFunction<'promise'>,
  bestNumber: BN_ONE,
  bounties: [] as DeriveBounties,
  bountyCuratorDeposit: balanceOf(500000),
  bountyDepositBase: BN_ONE,
  bountyUpdatePeriod: defaultBountyUpdatePeriod,
  bountyValueMinimum: BN_ONE,
  claimBounty: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  closeBounty: jest.fn(() => ({ length: 4 })) as unknown as SubmittableExtrinsicFunction<'promise'>,
  dataDepositPerByte: BN_ONE,
  extendBountyExpiry: jest.fn(() => 'mockExtendExtrinsic') as unknown as SubmittableExtrinsicFunction<'promise'>,
  maximumReasonLength: 100,
  proposeBounty: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  proposeCurator: jest.fn() as unknown as SubmittableExtrinsicFunction<'promise'>,
  unassignCurator: jest.fn(() => 'mockUnassignExtrinsic') as unknown as SubmittableExtrinsicFunction<'promise'>
};

const defaultBalance = balanceOf(1);

export const mockBountyHooks = {
  balance: defaultBalance,
  bountyApi: defaultBountyApi
};
