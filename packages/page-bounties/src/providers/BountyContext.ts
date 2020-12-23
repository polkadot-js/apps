// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveBounties } from '@polkadot/api-derive/types';
import type { BlockNumber } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import { createContext, useContext } from 'react';

import { SubmittableExtrinsic } from '@polkadot/api/types';

export type BountyApi = {
  bestNumber?: BlockNumber,
  bounties?: DeriveBounties,
  bountyDepositBase: BN,
  bountyDepositPerByte: BN,
  bountyValueMinimum: BN,
  maximumReasonLength: number,
  proposeBounty: ((...args: any[]) => SubmittableExtrinsic<'promise'>);

};
export const BountyContext = createContext<BountyApi>({} as BountyApi);

export function useBountyContext (): BountyApi {
  return useContext(BountyContext);
}
