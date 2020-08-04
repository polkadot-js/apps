// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback } from 'react';
import styled from 'styled-components';
import keyring from '@polkadot/ui-keyring';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { AddressRow, Button, Card, Expander, Forget } from '@polkadot/react-components';
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
    <Card className={className}>
      {isForgetOpen && (
        <Forget
          address={address.toString()}
          key='modal-forget-contract'
          mode='contract'
          onClose={toggleIsForgetOpen}
          onForget={_onForget}
        />
      )}
      <AddressRow
        buttons={
          <div className='contracts--Contract-buttons'>
            <Button
              icon='trash'
              onClick={toggleIsForgetOpen}
              tooltip={t<string>('Forget this contract')}
            />
            <Button
              icon='play'
              label={t<string>('execute')}
              onClick={onCall()}
              tooltip={t<string>('Call a method on this contract')}
            />
          </div>
        }
        isContract
        isEditableName
        isEditableTags
        type='contract'
        value={address}
        withBalance={false}
        withNonce={false}
        withTags
      >
        <Expander summary={t<string>('Messages')}>
          <Messages
            address={address.toString()}
            contractAbi={abi}
            isRemovable={false}
            onSelect={onCall}
          />
        </Expander>
      </AddressRow>
    </Card>
  );
}

export default React.memo(
  styled(Contract)`
    min-width: 100%;
    max-width: 100%;
  `
);
