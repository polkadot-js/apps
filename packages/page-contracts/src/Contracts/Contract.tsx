// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback } from 'react';
import keyring from '@polkadot/ui-keyring';
import { PromiseContract } from '@polkadot/api-contract';
import { AddressInfo, AddressMini, Button, Forget } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Messages from '../shared/Messages';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  contract: PromiseContract;
  onCall: (index?: number) => void;
}

function Contract ({ className, contract, onCall }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isForgetOpen, toggleIsForgetOpen] = useToggle();

  const _onForget = useCallback(
    (): void => {
      const status: Partial<ActionStatus> = {
        account: contract.address,
        action: 'forget'
      };

      try {
        keyring.forgetContract(contract.address.toString());
        status.status = 'success';
        status.message = t<string>('address forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }

      toggleIsForgetOpen();
    },
    [contract.address, t, toggleIsForgetOpen]
  );

  return (
    <tr className={className}>
      <td className='address top'>
        {isForgetOpen && (
          <Forget
            address={contract.address.toString()}
            key='modal-forget-contract'
            mode='contract'
            onClose={toggleIsForgetOpen}
            onForget={_onForget}
          />
        )}
        <AddressMini value={contract.address} />
      </td>
      <td className='all top'>
        <Messages
          contract={contract}
          contractAbi={contract.abi}
          isWatching
          onSelect={onCall}
          withMessages
        />
      </td>
      <td className='number'>
        <AddressInfo
          address={contract.address}
          withBalance
          withBalanceToggle
          withExtended={false}
        />
      </td>
      <td className='button'>
        <Button
          icon='trash'
          onClick={toggleIsForgetOpen}
        />
        {!contract.abi && (
          <Button
            icon='play'
            label={t<string>('exec')}
            onClick={onCall}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Contract);
