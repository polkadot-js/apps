// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ActionStatus } from '@polkadot/react-components/Status/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import styled from 'styled-components';
import { RouteComponentProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import keyring from '@polkadot/ui-keyring';
import { AddressRow, Button, Card, Forget, Messages } from '@polkadot/react-components';
import { getContractAbi } from '@polkadot/react-components/util';

import translate from '../translate';

interface Props extends I18nProps, RouteComponentProps {
  basePath: string;
  address: string;
  onCall: (callAddress?: string, callMethod?: string) => void;
}

interface State {
  isBackupOpen: boolean;
  isForgetOpen: boolean;
  isPasswordOpen: boolean;
}

const ContractCard = styled(Card)`
  && {
    min-width: 100%;
    max-width: 100%;
  }
`;

class Contract extends React.PureComponent<Props, State> {
  public state: State = {
    isBackupOpen: false,
    isForgetOpen: false,
    isPasswordOpen: false
  };

  public render (): React.ReactNode {
    const { address, onCall, t } = this.props;

    const contractAbi = getContractAbi(address);

    if (!contractAbi) {
      return null;
    }

    return (
      <ContractCard>
        {this.renderModals()}
        <AddressRow
          buttons={this.renderButtons()}
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
              contractAbi={contractAbi}
              isRemovable={false}
              onSelect={onCall}
            />
          </details>
        </AddressRow>
      </ContractCard>
    );
  }

  private renderModals (): React.ReactNode {
    const { address } = this.props;
    const { isForgetOpen } = this.state;

    if (!address) {
      return null;
    }

    const modals = [];

    if (isForgetOpen) {
      modals.push(
        <Forget
          address={address}
          mode='contract'
          onForget={this.onForget}
          key='modal-forget-contract'
          onClose={this.toggleForget}
        />
      );
    }

    return modals;
  }

  private toggleForget = (): void => {
    const { isForgetOpen } = this.state;

    this.setState({
      isForgetOpen: !isForgetOpen
    });
  }

  private onForget = (): void => {
    const { address, t } = this.props;

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
    this.toggleForget();
  }

  private renderButtons (): React.ReactNode {
    const { address, onCall, t } = this.props;

    return (
      <div className='contracts--Contract-buttons'>
        <Button
          icon='trash'
          isNegative
          onClick={this.toggleForget}
          size='small'
          tooltip={t('Forget this contract')}
        />
        <Button
          icon='play'
          isPrimary
          label={t('execute')}
          onClick={(): void => onCall(address)}
          size='small'
          tooltip={t('Call a method on this contract')}
        />
      </div>
    );
  }
}

export default translate(withRouter(Contract));
