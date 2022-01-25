// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { AddressSmall, Button } from '@polkadot/react-components';
import { useTranslation } from '@polkadot/react-components/translate';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, isFunction } from '@polkadot/util';

import BondLessModal from '../Modals/BondLessModal';
import BondMoreModal from '../Modals/BondMoreModal';
import UndelegateModal from '../Modals/UndelegateModal';
import { Delegation } from '../types';

interface Props {
  delegation: Delegation
  roundDuration: BN
}

function DelegationDetails ({ delegation, roundDuration }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const [isUndelegateOpen, toggleUndelegate] = useToggle();
  const [isBondMoreOpen, toggleBondMore] = useToggle();
  const [isBondLessOpen, toggleBondLess] = useToggle();

  return (
    <tr>
      <td className='address'>
        <AddressSmall value={delegation.collatorAddress} />
      </td>
      <td className='number media--1100'>
        { (
          <FormatBalance value={delegation.delegationAmount} /> // TODO: figure out why this isnt updating live
        )}
      </td>
      <td className='number media--1100'>
        {isBondMoreOpen && (
          <BondMoreModal
            collatorAddress={delegation.collatorAddress}
            key='modal-transfer'
            onClose={toggleBondMore}
          />
        )}
        {isFunction(api.tx.parachainStaking?.delegatorBondMore) && (
          <Button
            className='send-button'
            icon='paper-plane'
            label={t<string>('bond more')}
            onClick={toggleBondMore}
          />
        )}
      </td>
      <td className='number media--1100'>
        {isBondLessOpen && (
          <BondLessModal
            delegation={delegation}
            key='modal-transfer'
            onClose={toggleBondLess}
            roundDuration={roundDuration}
          />
        )}
        {isFunction(api.tx.parachainStaking?.scheduleDelegatorBondLess) && (
          <Button
            className='send-button'
            icon='paper-plane'
            label={t<string>('bond less')}
            onClick={toggleBondLess}
          />
        )}
      </td>
      <td className='number media--1100'>
        {isUndelegateOpen && (
          <UndelegateModal
            collatorAddress={delegation.collatorAddress}
            delegationAmount={delegation.delegationAmount}
            key='modal-transfer'
            onClose={toggleUndelegate}
            roundDuration={roundDuration}
          />
        )}
        {isFunction(api.tx.parachainStaking?.scheduleRevokeDelegation) && (
          <Button
            className='send-button'
            icon='paper-plane'
            label={t<string>('undelegate')}
            onClick={toggleUndelegate}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(DelegationDetails);
