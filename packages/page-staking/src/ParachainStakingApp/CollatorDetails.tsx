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

function CollatorDetails ({ address, className = '', collatorInfo, collatorStake, rank, selectedCollatorCount, setActiveNominators, setAllNominators }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const collatorState2 = useCall<string>(api.query.parachainStaking.collatorState2, [address]);
  const topNominators = collatorState2 ? (collatorState2 as any).value.topNominators : [];
  const bottomNominators = collatorState2 ? (collatorState2 as any).value.bottomNominators : [];
  const minContribution = topNominators?.length == collatorInfo.maxNominatorsPerCollator && topNominators?.length > 0 ? topNominators[topNominators?.length - 1].amount : collatorInfo.minNomination;

  useEffect(() => {
    if (rank < selectedCollatorCount) { setActiveNominators({ address, number: topNominators.length }); }

    setAllNominators({ address, number: topNominators.length + bottomNominators.length });
  }, [collatorState2]);

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={address} />
      </td>
      <td className='number media--1100'>
        {collatorStake?.gtn(0) && (
          <FormatBalance value={collatorState2 ? (collatorState2 as any).value.totalCounted : ''} /> // counted nominator stake
        )}
      </td>
      <td className='number media--1100'>
        {collatorStake?.gtn(0) && (
          <FormatBalance value={collatorState2 ? (collatorState2 as any).value.totalBacking : ''} /> // total nominator stake
        )}
      </td>
      <td className='number media--1100'>
        {collatorState2 ? (collatorState2 as any).value.nominators.length : ''}
      </td>
      <td className='number media--1100'>
        {collatorStake?.gtn(0) && (
          <FormatBalance value={collatorState2 ? (collatorState2 as any).value.bond : ''} /> // own stake
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
