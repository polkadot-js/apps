// Copyright 2017-2025 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SubmittableExtrinsicFunction } from '@polkadot/api/types';
import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { Codec } from '@polkadot/types/types';
import type { BN } from '@polkadot/util';

import { useMemo } from 'react';

import { createNamedHook, useApi, useBestNumber, useCall } from '@polkadot/react-hooks';
import { BN_ZERO } from '@polkadot/util';

interface BountyApiTxs {
  acceptCurator: SubmittableExtrinsicFunction<'promise'>;
  approveBounty: SubmittableExtrinsicFunction<'promise'>;
  awardBounty: SubmittableExtrinsicFunction<'promise'>;
  claimBounty: SubmittableExtrinsicFunction<'promise'>;
  closeBounty: SubmittableExtrinsicFunction<'promise'>;
  extendBountyExpiry: SubmittableExtrinsicFunction<'promise'>;
  proposeBounty: SubmittableExtrinsicFunction<'promise'>;
  proposeCurator: SubmittableExtrinsicFunction<'promise'>;
  unassignCurator: SubmittableExtrinsicFunction<'promise'>;
}

interface BountyApiConstants {
  bountyCuratorDeposit: BN;
  bountyDepositBase: BN;
  bountyUpdatePeriod?: BN;
  bountyValueMinimum: BN;
  dataDepositPerByte: BN;
  maximumReasonLength: number;
}

interface BountyApiStatics extends BountyApiConstants, BountyApiTxs {
  // nothing additional
}

export interface BountyApi extends BountyApiStatics {
  bestNumber?: BN;
  bounties?: DeriveBounties;
  bountyCount?: BN;
  childCount?: BN;
}

function getStatics (api: ApiPromise): BountyApiStatics {
  const constsBase = api.consts.bounties || api.consts.treasury;
  const txBase = api.tx.bounties || api.tx.treasury;

  return {
    // constants
    bountyCuratorDeposit: (constsBase.bountyCuratorDeposit as (BN & Codec)) || BN_ZERO,
    bountyDepositBase: constsBase.bountyDepositBase,
    bountyUpdatePeriod: constsBase.bountyUpdatePeriod,
    bountyValueMinimum: constsBase.bountyValueMinimum,
    dataDepositPerByte: constsBase.dataDepositPerByte,
    maximumReasonLength: constsBase.maximumReasonLength.toNumber(),

    // extrinsics
    // eslint-disable-next-line sort-keys
    acceptCurator: txBase.acceptCurator,
    approveBounty: txBase.approveBounty,
    awardBounty: txBase.awardBounty,
    claimBounty: txBase.claimBounty,
    closeBounty: txBase.closeBounty,
    extendBountyExpiry: txBase.extendBountyExpiry,
    proposeBounty: txBase.proposeBounty,
    proposeCurator: txBase.proposeCurator,
    unassignCurator: txBase.unassignCurator
  };
}

function useBountiesImpl (): BountyApi {
  const { api } = useApi();
  const bounties = useCall<DeriveBounties>(api.derive.bounties.bounties);
  const bountyCount = useCall<BN>((api.query.bounties || api.query.treasury).bountyCount);
  const childCount = useCall<BN>(api.query.childBounties?.childBountyCount);
  const bestNumber = useBestNumber();

  const statics = useMemo(
    () => getStatics(api),
    [api]
  );

  return useMemo(
    (): BountyApi => ({
      ...statics,
      bestNumber,
      bounties,
      bountyCount,
      childCount
    }),
    [bestNumber, bounties, bountyCount, childCount, statics]
  );
}

export const useBounties = createNamedHook('useBounties', useBountiesImpl);
