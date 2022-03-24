// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParachainStakingBond, ParachainStakingDelegationRequest, ParachainStakingRoundInfo } from '@polkadot/types/lookup';

import React from 'react';

import { AddressSmall, Button } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { isFunction } from '@polkadot/util';

import BondLessModal from '../Modals/BondLessModal';
import BondMoreModal from '../Modals/BondMoreModal';
import CancelRequestModal from '../Modals/CancelRequestModal';
import ExecuteRequestModal from '../Modals/ExecuteRequestModal';
import RevokeModal from '../Modals/RevokeModal';

interface Props {
  delegation: ParachainStakingBond
  roundInfo?: ParachainStakingRoundInfo;
  request?: ParachainStakingDelegationRequest
  userAddress: string | null
}

function DelegationDetails ({ delegation, request, roundInfo, userAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isRevokeOpen, toggleRevoke] = useToggle();
  const [isBondMoreOpen, toggleBondMore] = useToggle();
  const [isBondLessOpen, toggleBondLess] = useToggle();
  const [isExecuteRequestOpen, toggleExecuteRequest] = useToggle();
  const [isCancelRequestOpen, toggleCancelRequest] = useToggle();

  const roundDuration = roundInfo?.length;
  const requestExecutable = !!request && roundInfo?.current.gte(request.whenExecutable);

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
            candidateAddress={delegation.owner}
            delegatorAddress={userAddress}
            key='modal-transfer'
            onClose={toggleBondMore}
          />
        )}
        {isFunction(api.tx.parachainStaking?.delegatorBondMore) && (
          <Button
            icon='plus'
            isDisabled={!!request}
            label={t<string>('bond more')}
            onClick={toggleBondMore}
          />
        )}
      </td>
      <td className='button media--1000'>
        {isBondLessOpen && (
          <BondLessModal
            delegation={delegation}
            delegatorAddress={userAddress}
            key='modal-transfer'
            onClose={toggleBondLess}
            roundDuration={roundDuration}
          />
        )}
        {request?.action.toHuman() === 'Decrease'
          ? (
            <Button
              icon={requestExecutable ? 'paper-plane' : 'hourglass'}
              isDisabled={!requestExecutable}
              label={
                t<string>(requestExecutable
                  ? 'execute bond less'
                  : `round ${request?.whenExecutable.toHuman()}`
                )
              }
              onClick={toggleExecuteRequest}
            />
          )
          : isFunction(api.tx.parachainStaking?.scheduleDelegatorBondLess) && (
            <Button
              icon='minus'
              isDisabled={!!request}
              label={t<string>('schedule bond less')}
              onClick={toggleBondLess}
            />
          )
        }
      </td>
      <td className='button media--1000'>
        {isRevokeOpen && (
          <RevokeModal
            candidateAddress={delegation.owner}
            delegationAmount={delegation.amount}
            delegatorAddress={userAddress}
            key='modal-transfer'
            onClose={toggleRevoke}
            roundDuration={roundDuration}
          />
        )}
        {request?.action.toHuman() === 'Revoke'
          ? (
            <Button
              icon={requestExecutable ? 'paper-plane' : 'hourglass'}
              isDisabled={!requestExecutable}
              label={
                t<string>(requestExecutable
                  ? 'execute revoke'
                  : `round ${request?.whenExecutable.toHuman()}`
                )
              }
              onClick={toggleExecuteRequest}
            />
          )
          : (isFunction(api.tx.parachainStaking?.scheduleRevokeDelegation)) && (
            <Button
              icon='times'
              isDisabled={!!request}
              label={t<string>('schedule revoke')}
              onClick={toggleRevoke}
            />
          )}
      </td>
      <td className='button media--1000'>
        {request
          ? <>
            {isCancelRequestOpen && (
              <CancelRequestModal
                candidateAddress={delegation.owner}
                delegatorAddress={userAddress}
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
          : (
            <Button
              isDisabled
              label={t<string>('no request scheduled')}
            />
          )
        }
        {isExecuteRequestOpen && (
          <ExecuteRequestModal
            candidateAddress={delegation.owner}
            delegatorAddress={userAddress}
            key='modal-transfer'
            onClose={toggleExecuteRequest}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(DelegationDetails);
