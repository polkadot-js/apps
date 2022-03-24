// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type {
  ParachainStakingBond,
  ParachainStakingRoundInfo
} from '@polkadot/types/lookup'

import React from 'react';

import { AddressSmall, Button } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, isFunction } from '@polkadot/util';

import BondLessModal from '../Modals/BondLessModal';
import BondMoreModal from '../Modals/BondMoreModal';
import RevokeModal from '../Modals/RevokeModal';
import ExecuteRequestModal from '../Modals/ExecuteRequestModal';
import CancelRequestModal from '../Modals/CancelRequestModal';
import { ActionRequest } from '../types';

interface Props {
  delegation: ParachainStakingBond
  roundInfo?: ParachainStakingRoundInfo;
  request: undefined | ActionRequest
  userAddress: string | null
}

function DelegationDetails ({ delegation, roundInfo, request, userAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isRevokeOpen, toggleRevoke] = useToggle();
  const [isBondMoreOpen, toggleBondMore] = useToggle();
  const [isBondLessOpen, toggleBondLess] = useToggle();
  const [isExecuteRequestOpen, toggleExecuteRequest] = useToggle();
  const [isCancelRequestOpen, toggleCancelRequest] = useToggle();

  const roundDuration = roundInfo?.length;
  const requestExecutable = !!request && roundInfo?.current.gte(new BN(request.whenExecutable));

  return (
    <tr>
      <td className='address'>
        <AddressSmall value={delegation.owner} />
      </td>
      <td className='number media--1000'>
        <FormatBalance value={delegation.amount} />
      </td>
      <td className='button media--1000'>
        {isBondMoreOpen && (
          <BondMoreModal
            key='modal-transfer'
            candidateAddress={delegation.owner}
            delegatorAddress={userAddress}
            onClose={toggleBondMore}
          />
        )}
        {isFunction(api.tx.parachainStaking?.delegatorBondMore) && (
          <Button
            icon='plus'
            label={t<string>('bond more')}
            onClick={toggleBondMore}
            isDisabled={!!request}
          />
        )}
      </td>
      <td className='button media--1000'>
        {isBondLessOpen && (
          <BondLessModal
            delegation={delegation}
            key='modal-transfer'
            onClose={toggleBondLess}
            roundDuration={roundDuration}
            delegatorAddress={userAddress}
          />
        )}
        {request?.action === 'Decrease'
          ?
            <Button
              icon={requestExecutable ? 'paper-plane' : 'hourglass'}
              label={
                t<string>(requestExecutable
                  ? 'execute bond less'
                  : `round ${request?.whenExecutable}`
                )
              }
              onClick={toggleExecuteRequest}
              isDisabled={!requestExecutable}
            />
          :
            isFunction(api.tx.parachainStaking?.scheduleDelegatorBondLess) && (
              <Button
                icon='minus'
                label={t<string>('schedule bond less')}
                onClick={toggleBondLess}
                isDisabled={!!request}
              />
            )
        }
      </td>
      <td className='button media--1000'>
        {isRevokeOpen && (
          <RevokeModal
            candidateAddress={delegation.owner}
            delegatorAddress={userAddress}
            delegationAmount={delegation.amount}
            key='modal-transfer'
            onClose={toggleRevoke}
            roundDuration={roundDuration}
          />
        )}
        {request?.action === 'Revoke'
          ?
            <Button
              icon={requestExecutable ? 'paper-plane' : 'hourglass'}
              label={
                t<string>(requestExecutable
                  ? 'execute revoke'
                  : `round ${request?.whenExecutable}`
                )
              }
              onClick={toggleExecuteRequest}
              isDisabled={!requestExecutable}
            />
          :
            (isFunction(api.tx.parachainStaking?.scheduleRevokeDelegation)) && (
            <Button
              icon='times'
              label={t<string>('schedule revoke')}
              onClick={toggleRevoke}
              isDisabled={!!request}
            />
        )}
      </td>
      <td className='button media--1000'>
        {!!request 
          ? <>
              {isCancelRequestOpen && (
                <CancelRequestModal
                  delegatorAddress={userAddress}
                  candidateAddress={delegation.owner}
                  key='modal-transfer'
                  onClose={toggleCancelRequest}
                />
              )}
              {isFunction(api.tx.parachainStaking?.cancelDelegationRequest) && (
                <Button
                  icon='ban'
                  label={t<string>('cancel request')}
                  onClick={toggleCancelRequest}
                />
              )}
            </>
          :

            <Button
              label={t<string>('no request scheduled')}
              isDisabled
            />
        }
        {isExecuteRequestOpen && (
          <ExecuteRequestModal
            delegatorAddress={userAddress}
            candidateAddress={delegation.owner}
            key='modal-transfer'
            onClose={toggleExecuteRequest}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(DelegationDetails);
