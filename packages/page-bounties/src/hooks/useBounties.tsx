// Copyright 2017-2022 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { BN } from '@polkadot/util';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { createNamedHook, useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { BalanceOf, BlockNumber, BountyIndex } from '@polkadot/types/interfaces';

export type BountyApi = {
  acceptCurator: SubmittableExtrinsicFunction<'promise'>;
  approveBounty: SubmittableExtrinsicFunction<'promise'>;
  awardBounty: SubmittableExtrinsicFunction<'promise'>;
  bestNumber?: BlockNumber,
  bounties?: DeriveBounties,
  bountyCuratorDeposit: BN,
  bountyDepositBase: BN,
  bountyIndex?: BN,
  bountyUpdatePeriod?: BN,
  bountyValueMinimum: BN,
  claimBounty: SubmittableExtrinsicFunction<'promise'>;
  closeBounty: SubmittableExtrinsicFunction<'promise'>;
  dataDepositPerByte: BN,
  extendBountyExpiry: SubmittableExtrinsicFunction<'promise'>;
  maximumReasonLength: number,
  proposeBounty: SubmittableExtrinsicFunction<'promise'>;
  proposeCurator: SubmittableExtrinsicFunction<'promise'>;
  unassignCurator: SubmittableExtrinsicFunction<'promise'>;
};

function useBountiesImpl (): BountyApi {
  const { api } = useApi();
  const bounties = useCall<DeriveBounties>(api.derive.bounties.bounties);
  const bountyIndex = useCall<BountyIndex>((api.query.bounties || api.query.treasury).bountyCount);
  const bestNumber = useBestNumber();
  const constsBase = api.consts.bounties || api.consts.treasury;
  const bountyCuratorDeposit = (constsBase.bountyCuratorDeposit as BalanceOf).toBn();
  const bountyDepositBase = (constsBase.bountyDepositBase as BalanceOf).toBn();
  const bountyValueMinimum = (constsBase.bountyValueMinimum as BalanceOf).toBn();
  const maximumReasonLength = constsBase.maximumReasonLength.toNumber();
  const dataDepositPerByte = (constsBase.dataDepositPerByte as BalanceOf).toBn();
  const bountyUpdatePeriod = constsBase.bountyUpdatePeriod;
  const proposeBounty = (api.tx.bounties || api.tx.treasury).proposeBounty;
  const proposeCurator = (api.tx.bounties || api.tx.treasury).proposeCurator;
  const claimBounty = (api.tx.bounties || api.tx.treasury).claimBounty;
  const acceptCurator = (api.tx.bounties || api.tx.treasury).acceptCurator;
  const approveBounty = (api.tx.bounties || api.tx.treasury).approveBounty;
  const closeBounty = (api.tx.bounties || api.tx.treasury).closeBounty;
  const extendBountyExpiry = (api.tx.bounties || api.tx.treasury).extendBountyExpiry;
  const unassignCurator = (api.tx.bounties || api.tx.treasury).unassignCurator;
  const awardBounty = (api.tx.bounties || api.tx.treasury).awardBounty;

  return {
    acceptCurator,
    approveBounty,
    awardBounty,
    bestNumber,
    bounties,
    bountyCuratorDeposit,
    bountyDepositBase,
    bountyIndex,
    bountyUpdatePeriod,
    bountyValueMinimum,
    claimBounty,
    closeBounty,
    dataDepositPerByte,
    extendBountyExpiry,
    maximumReasonLength,
    proposeBounty,
    proposeCurator,
    unassignCurator
  };
}

export const useBounties = createNamedHook('useBounties', useBountiesImpl);
