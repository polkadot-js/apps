// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

export interface CollatorInfo{minDelegation: string, maxDelegatorsPerCandidate: string}

interface Props {
  className?: string;
  collatorDetails: CollatorState
  collatorInfo: CollatorInfo
}

export interface CollatorState {
  id: string;
  bond: string;
  delegators: string[]
  topDelegations: {amount: string}[]
  bottomDelegations: string[]
  totalCounted: string
  totalBacking: string
  state: string
}

function CollatorDetails ({ className = '', collatorDetails, collatorInfo }: Props): React.ReactElement<Props> | null {
  const { bond,
    delegators,
    topDelegations,
    totalBacking,
    totalCounted } = collatorDetails || { bond: new BN(0),
    nominators: [],
    topNominators: [],
    totalBacking: new BN(0),
    totalCounted: new BN(0) };
  const minContribution = topDelegations?.length === Number(collatorInfo.maxDelegatorsPerCandidate) && topDelegations?.length > 0 ? topDelegations[topDelegations?.length - 1].amount : collatorInfo.minDelegation;

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={collatorDetails.id} />
      </td>
      <td className='number media--1100'>
        {totalCounted && (
          <FormatBalance value={totalCounted} /> // counted nominator stake
        )}
      </td>
      <td className='number media--1100'>
        {totalBacking && (
          <FormatBalance value={totalBacking} /> // total nominator stake
        )}
      </td>
      <td className='number media--1100'>
        {delegators.length}
      </td>
      <td className='number media--1100'>
        {bond && (
          <FormatBalance value={bond} /> // own stake
        )}
      </td>
      <td className='number media--1100'>
        {minContribution !== '0' && (
          <FormatBalance value={minContribution} /> // minContribution
        )}
      </td>
    </tr>
  );
}

export default React.memo(CollatorDetails);
