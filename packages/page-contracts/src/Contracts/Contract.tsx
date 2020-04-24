// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';
import { PromiseContract as ApiContract } from '@polkadot/api-contract';
import { AddressRow, Button, Card, Expander, Forget } from '@polkadot/react-components';

import Messages from '../Messages';
import { useTranslation } from '../translate';

interface Props extends RouteComponentProps {
  basePath: string;
  contract: ApiContract;
  onCall: (_?: number) => () => void;
}

const ContractCard = styled(Card)`
  && {
    min-width: 100%;
    max-width: 100%;
  }
`;

function Contract (props: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { contract: { abi, address }, onCall } = props;
  const [isForgetOpen, setIsForgetOpen] = useState(false);

  if (!address || !abi) {
    return null;
  }

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
      keyring.forgetContract(address.toString());
      status.status = 'success';
      status.message = t('address forgotten');
    } catch (error) {
      status.status = 'error';
      status.message = error.message;
    }

    _toggleForget();
  };

  return (
    <ContractCard>
      {isForgetOpen && (
        <Forget
          address={address.toString()}
          key='modal-forget-contract'
          mode='contract'
          onClose={_toggleForget}
          onForget={_onForget}
        />
      )}
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
              onClick={onCall()}
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
        <Expander summary={t('Messages')}>
          <Messages
            address={address.toString()}
            contractAbi={abi}
            isRemovable={false}
            onSelect={onCall}
          />
        </Expander>
      </AddressRow>
    </ContractCard>
  );
}

export default withRouter(Contract);
