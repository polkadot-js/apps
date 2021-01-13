// Copyright 2017-2021 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';

import BN from 'bn.js';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceOf, BlockNumber, BountyIndex } from '@polkadot/types/interfaces';

export type BountyApi = {
  approveBounty: ((...args: any[]) => SubmittableExtrinsic<'promise'>);
  bestNumber?: BlockNumber,
  bounties?: DeriveBounties,
  bountyDepositBase: BN,
  bountyIndex?: BN,
  bountyValueMinimum: BN,
  closeBounty: ((...args: any[]) => SubmittableExtrinsic<'promise'>);
  dataDepositPerByte: BN,
  maximumReasonLength: number,
  proposeBounty: ((...args: any[]) => SubmittableExtrinsic<'promise'>);
};

export function useBounties (): BountyApi {
  const { api } = useApi();
  const bounties = useCall<DeriveBounties>(api.derive.bounties.bounties);
  const bountyIndex = useCall<BountyIndex>((api.query.bounties || api.query.treasury).bountyCount);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const constsBase = api.consts.bounties || api.consts.treasury;
  const bountyDepositBase = (constsBase.bountyDepositBase as BalanceOf).toBn();
  const bountyValueMinimum = (constsBase.bountyValueMinimum as BalanceOf).toBn();
  const maximumReasonLength = constsBase.maximumReasonLength.toNumber();
  const dataDepositPerByte = (constsBase.dataDepositPerByte as BalanceOf).toBn();
  const proposeBounty = (api.tx.bounties || api.tx.treasury).proposeBounty;
  const approveBounty = (api.tx.bounties || api.tx.treasury).approveBounty;
  const closeBounty = (api.tx.bounties || api.tx.treasury).closeBounty;

  return {
    approveBounty,
    bestNumber,
    bounties,
    bountyDepositBase,
    bountyIndex,
    bountyValueMinimum,
    closeBounty,
    dataDepositPerByte,
    maximumReasonLength,
    proposeBounty
  };
}
