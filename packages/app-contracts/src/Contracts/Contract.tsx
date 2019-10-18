// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { CallContract, I18nProps } from '@polkadot/react-components/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';
import { AddressRow, Button, Card, Forget, Messages } from '@polkadot/react-components';

import translate from '../translate';

interface Props extends I18nProps, RouteComponentProps {
  basePath: string;
  contract: CallContract;
  onCall: (_: CallContract) => (_?: number) => () => void;
}

const ContractCard = styled(Card)`
  && {
    min-width: 100%;
    max-width: 100%;
  }
`;

function Contract (props: Props): React.ReactElement<Props> | null {
  const { contract, contract: { abi, address }, onCall, t } = props;

  if (!address || !abi) {
    return null;
  }

  const [isForgetOpen, setIsForgetOpen] = useState(false);

  const _toggleForget = (): void => setIsForgetOpen(!isForgetOpen);
  const _onForget = (): void => {
    if (!address) {
      return;
    }

    const status: Partial<ActionStatus> = {
      account: address,
      action: 'forget'
    };

    try {
      keyring.forgetContract(address);
      status.status = 'success';
      status.message = t('address forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }
    _toggleForget();
  };

  const _onCallMessage = onCall(contract);
  const _onCall = _onCallMessage();

  return (
    <ContractCard>
      {
        isForgetOpen && (
          <Forget
            address={address}
            mode='contract'
            onForget={_onForget}
            key='modal-forget-contract'
            onClose={_toggleForget}
          />
        )
      }
      <AddressRow
        buttons={
          <div className='contracts--Contract-buttons'>
            <Button
              icon='trash'
              isNegative
              onClick={_toggleForget}
              size='small'
              tooltip={t('Forget this contract')}
            />
            <Button
              icon='play'
              isPrimary
              label={t('execute')}
              onClick={_onCall}
              size='small'
              tooltip={t('Call a method on this contract')}
            />
          </div>
        }
        isContract
        isEditable
        type='contract'
        value={address}
        withBalance={false}
        withNonce={false}
        withTags
      >
        <details>
          <summary>{t('Messages')}</summary>
          <Messages
            address={address}
            contractAbi={abi}
            isRemovable={false}
            onSelect={_onCallMessage}
          />
        </details>
      </AddressRow>
    </ContractCard>
  );
}

export default translate(withRouter(Contract));
