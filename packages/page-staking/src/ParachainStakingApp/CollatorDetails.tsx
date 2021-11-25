// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

interface Props {
  className?: string;
  collatorDetails: CollatorState2
  collatorInfo: {minNomination: string, maxNominatorsPerCollator: string}
}

export interface CollatorState2 {
  id: string;
  bond: string;
  nominators: string[]
  topNominators: {amount: string}[]
  bottomNominators: string[]
  totalCounted: string
  totalBacking: string
  state: string
}

function CollatorDetails ({ className = '', collatorDetails, collatorInfo }: Props): React.ReactElement<Props> | null {
  const { bond,
    nominators,
    topNominators,
    totalBacking,
    totalCounted } = collatorDetails || { bond: new BN(0),
    nominators: [],
    topNominators: [],
    totalBacking: new BN(0),
    totalCounted: new BN(0) };
  const minContribution = topNominators?.length === Number(collatorInfo.maxNominatorsPerCollator) && topNominators?.length > 0 ? topNominators[topNominators?.length - 1].amount : collatorInfo.minNomination;

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
        {nominators.length}
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
