// Copyright 2017-2020 @polkadot/app-bounties authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { ReactElement, ReactNode } from 'react';

import { DeriveBounties } from '@polkadot/api-derive/types';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BalanceOf, BlockNumber } from '@polkadot/types/interfaces';

import { BountyApi, BountyContext } from './BountyContext';

export function BountyProvider ({ children }: { children: ReactNode }): ReactElement {
  const { api } = useApi();
  const bounties = useCall<DeriveBounties>((api.derive.bounties || api.derive.treasury).bounties);
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber);
  const constsBase = api.consts.bounties || api.consts.treasury;
  const bountyDepositBase = (constsBase.bountyDepositBase as BalanceOf).toBn();
  const bountyValueMinimum = (constsBase.bountyValueMinimum as BalanceOf).toBn();
  const maximumReasonLength = constsBase.maximumReasonLength.toNumber();
  const bountyDepositPerByte = (constsBase.bountyDepositPerByte as BalanceOf).toBn();
  const proposeBounty = (api.tx.bounties || api.tx.treasury).proposeBounty;
  const bountiesApi: BountyApi = {
    bestNumber,
    bounties,
    bountyDepositBase,
    bountyDepositPerByte,
    bountyValueMinimum,
    maximumReasonLength,
    proposeBounty
  };

  return <BountyContext.Provider value={bountiesApi} >
    {children}
  </BountyContext.Provider>;
}
