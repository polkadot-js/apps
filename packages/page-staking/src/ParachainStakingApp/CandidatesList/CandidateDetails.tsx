// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u128 } from '@polkadot/types-codec';

import React from 'react';

import { AddressSmall, Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import DelegateModal from '../Modals/DelegateModal';
import { CandidateState } from '../types';

interface Props {
  className?: string;
  candidateState: CandidateState
}

function CandidateDetails ({ candidateState, className = '' }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { bond,
    delegationCount,
    lowestTopDelegationAmount,
    topCapacity,
    totalBacking,
    totalCounted } = candidateState;
  const [isDelegateOpen, toggleDelegate] = useToggle();

  const minContribution = topCapacity.toHuman() === 'Full'
    ? lowestTopDelegationAmount
    : api.consts.parachainStaking.minDelegation as u128;

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={candidateState.id} />
      </td>
      <td className='number media--1100'>
        {totalCounted && (
          <FormatBalance value={totalCounted} /> // counted delegated stake
        )}
      </td>
      <td className='number media--1100'>
        {totalBacking && (
          <FormatBalance value={totalBacking} /> // total delegated stake
        )}
      </td>
      <td className='number media--1100'>
        {formatNumber(delegationCount)}
      </td>
      <td className='number media--1100'>
        {bond && (
          <FormatBalance value={bond} /> // own stake
        )}
      </td>
      <td className='number media--1100'>
        <FormatBalance value={minContribution} />
      </td>
      <td className='number media--1100'>
        {isDelegateOpen && (
          <DelegateModal
            candidateAddress={candidateState.id}
            key='modal-transfer'
            minContribution={minContribution}
            onClose={toggleDelegate}
          />
        )}
        {isFunction(api.tx.parachainStaking?.delegate) && (
          <Button
            icon='paper-plane'
            label={t<string>('delegate')}
            onClick={toggleDelegate}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(CandidateDetails);
