// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall, Button, TxButton } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { BN } from '@polkadot/util';
import { useTranslation } from '../../translate';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { BN_HUNDRED, BN_ZERO, isFunction } from '@polkadot/util';
import DelegateModal from './DelegateModal';


export const GLMR = 1_000_000_000_000_000_000n;
export const MIN_GLMR_NOMINATOR = 5n * GLMR; //TODO fetch from api

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
  topDelegations: {amount: string,owner: Uint8Array}[]
  bottomDelegations: string[]
  totalCounted: string
  totalBacking: string
  state: string
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
              key='modal-transfer'
              onClose={toggleDelegate}
              collatorAddress={collatorDetails.id}
              minContribution={minContribution}
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
      {/* <TxButton
          accountId={collatorDetails.id}
          icon='paper-plane'
          // isDisabled={!hasAvailable || !(propRecipientId || recipientId) || !amount || !!recipientPhish}
          label={t<string>('Delegate')}
          // onStart={onClose}
          params={
            // canToggleAll && isAll
            //   ? isFunction(api.tx.balances.transferAll)
            //     ? [propRecipientId || recipientId, false]
            //     : [propRecipientId || recipientId, maxTransfer]
            //   : [propRecipientId || recipientId, amount]
            [collatorDetails.id,MIN_GLMR_NOMINATOR,0,0]// TOD: fetch last parameters
          }
          tx={
            // canToggleAll && isAll && isFunction(api.tx.balances.transferAll)
            //   ? api.tx.balances.transferAll
            //   : isProtected
            //     ? api.tx.balances.transferKeepAlive
            //     : api.tx.balances.transfer

            // isFunction(api.tx.parachainStaking.delegate)&&
            api.tx.parachainStaking.delegate
          }
        /> */}
      </td>
    </tr>
  );
}

export default React.memo(CollatorDetails);
