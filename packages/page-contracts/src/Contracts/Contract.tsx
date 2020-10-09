// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback } from 'react';
import keyring from '@polkadot/ui-keyring';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { AddressMini, Button, Forget } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Messages from '../shared/Messages';
import { useTranslation } from '../translate';

interface Props {
  className?: string;
  contract: ApiContract;
  onCall: (_?: number) => () => void;
}

function Contract ({ className, contract: { abi, address }, onCall }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const [isForgetOpen, toggleIsForgetOpen] = useToggle();

  const _onForget = useCallback(
    (): void => {
      if (!address) {
        return;
      }

      const status: Partial<ActionStatus> = {
        account: address,
        action: 'forget'
      };

      try {
        keyring.forgetContract(address.toString());
        status.status = 'success';
        status.message = t<string>('address forgotten');
      } catch (error) {
        status.status = 'error';
        status.message = (error as Error).message;
      }

      toggleIsForgetOpen();
    },
    [address, t, toggleIsForgetOpen]
  );

  if (!address || !abi) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='address top'>
        {isForgetOpen && (
          <Forget
            address={address.toString()}
            key='modal-forget-contract'
            mode='contract'
            onClose={toggleIsForgetOpen}
            onForget={_onForget}
          />
        )}
        <AddressMini value={address} />
      </td>
      <td className='all top'>
        <Messages
          address={address.toString()}
          contractAbi={abi}
          isRemovable={false}
          onSelect={onCall}
          withMessages
        />
      </td>
      <td className='button'>
        <Button
          icon='trash'
          onClick={toggleIsForgetOpen}
        />
        <Button
          icon='play'
          label={t<string>('exec')}
          onClick={onCall()}
        />
      </td>
    </tr>
  );
}

export default React.memo(Contract);
