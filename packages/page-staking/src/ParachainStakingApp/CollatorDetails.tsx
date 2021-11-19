// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React, { useEffect } from 'react';

import { AddressSmall } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';

interface Props {
  rank: number;
  address: string;
  className?: string;
  collatorStake: BN
  collatorInfo: {minNomination: string, maxNominatorsPerCollator: string}
  setActiveNominators: (input: {address: string, number: number}) => void
  setAllNominators: (input: {address: string, number: number}) => void
  selectedCollatorCount: number
}

interface CollatorState2 {
  value: {
    bond: BN
    nominators: string[]
    topNominators: {amount: BN}[]
    bottomNominators: string[]
    totalCounted: BN
    totalBacking: BN
  }
}

function CollatorDetails ({ address, className = '', collatorInfo, collatorStake, rank, selectedCollatorCount, setActiveNominators, setAllNominators }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const collatorState2 = useCall<CollatorState2>(api.query.parachainStaking.collatorState2, [address]);
  const { bond,
    bottomNominators,
    nominators,
    topNominators,
    totalBacking,
    totalCounted } = collatorState2
    ? collatorState2.value
    : { bond: new BN(0),
      bottomNominators: [],
      nominators: [],
      topNominators: [],
      totalBacking: new BN(0),
      totalCounted: new BN(0) };
  const minContribution = topNominators?.length === Number(collatorInfo.maxNominatorsPerCollator) && topNominators?.length > 0 ? topNominators[topNominators?.length - 1].amount : collatorInfo.minNomination;

  useEffect(() => {
    if (rank < selectedCollatorCount) { setActiveNominators({ address, number: topNominators.length }); }

    setAllNominators({ address, number: topNominators.length + bottomNominators.length });
  }, [address, bottomNominators, collatorState2, rank, topNominators, selectedCollatorCount, setActiveNominators, setAllNominators]);

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number media--1100'>
        {collatorStake?.gtn(0) && (
          <FormatBalance value={totalCounted} /> // counted nominator stake
        )}
      </td>
      <td className='number media--1100'>
        {collatorStake?.gtn(0) && (
          <FormatBalance value={totalBacking} /> // total nominator stake
        )}
      </td>
      <td className='number media--1100'>
        {nominators.length}
      </td>
      <td className='number media--1100'>
        {collatorStake?.gtn(0) && (
          <FormatBalance value={bond} /> // own stake
        )}
      </td>
      <td className='number media--1100'>
        {collatorStake?.gtn(0) && (
          <FormatBalance value={minContribution} /> // minContribution
        )}
      </td>
    </tr>
  );
}

export default React.memo(CollatorDetails);
