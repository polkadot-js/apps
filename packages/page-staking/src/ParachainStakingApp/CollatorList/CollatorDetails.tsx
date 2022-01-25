// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall, Button } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, isFunction } from '@polkadot/util';

import { useTranslation } from '../../translate';
import DelegateModal from '../Modals/DelegateModal';
import { CollatorInfo, CollatorState } from '../types';

export const GLMR = 1_000_000_000_000_000_000n;
export const MIN_GLMR_NOMINATOR = 5n * GLMR; // TODO fetch from api

interface Props {
  className?: string;
  collatorDetails: CollatorState
  collatorInfo: CollatorInfo
}

function CollatorDetails ({ className = '', collatorDetails, collatorInfo }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
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
  const [isDelegateOpen, toggleDelegate] = useToggle();

  return (
    <tr className={className}>
      <td className='address'>
        <AddressSmall value={collatorDetails.id} />
      </td>
      <td className='number media--1100'>
        {totalCounted && (
          <FormatBalance value={totalCounted} /> // counted nominator stake //TODO: maybe we should subtract the "own stake" amount from this (also true for next variable) - see case for zero delegation
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
      <td className='number media--1100'>
        {isDelegateOpen && (
          <DelegateModal
            collatorAddress={collatorDetails.id}
            key='modal-transfer'
            minContribution={minContribution}
            onClose={toggleDelegate}
          />
        )}
        {isFunction(api.tx.parachainStaking?.delegate) && (
          <Button
            className='send-button'
            icon='paper-plane'
            label={t<string>('delegate')}
            onClick={toggleDelegate}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(CollatorDetails);
